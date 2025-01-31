class WebhooksController < ApplicationController
  before_action :verify_webhook_signature

  def stripe
    payload = request.body.read
    event = Stripe::Event.construct_from(JSON.parse(payload))

    case event.type
    when "customer.subscription.created"
      handle_subscription_created(event.data.object)
    when "customer.subscription.updated"
      handle_subscription_updated(event.data.object)
    when "customer.subscription.deleted"
      handle_subscription_cancelled(event.data.object)
    end

    head :ok
  rescue JSON::ParserError => e
    Rails.logger.error(e)
    head :bad_request
  rescue Stripe::SignatureVerificationError => e
    Rails.logger.error(e)
    head :unauthorized
  end

  private

  def verify_webhook_signature
    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]

    begin
      Stripe::Webhook.construct_event(
        payload, sig_header, ENV["STRIPE_WEBHOOK_SECRET"]
      )
    rescue Stripe::SignatureVerificationError => e
      Rails.logger.error(e)
      head :unauthorized
    end
  end

  def handle_subscription_created(subscription)
    metadata = subscription.metadata

    organization = Organization.find_by!(public_id: metadata[:organization_id])
    plan = Plan.find_by!(public_id: metadata[:plan_id])

    organization.subscriptions.create!(
      plan: plan,
      status: subscription.status,
      start_date: Time.at(subscription.current_period_start),
      end_date: Time.at(subscription.current_period_end),
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer
    )
  end

  def handle_subscription_updated(subscription)
    subscription_record = Subscription.find_by!(
      stripe_subscription_id: subscription.id
    )

    subscription_record.update!(
      status: subscription.status,
      end_date: Time.at(subscription.current_period_end)
    )
  end

  def handle_subscription_cancelled(subscription)
    subscription_record = Subscription.find_by!(
      stripe_subscription_id: subscription.id
    )
    subscription_record.update!(status: "cancelled")
  end
end
