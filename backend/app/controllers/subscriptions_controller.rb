class SubscriptionsController < ApplicationController
  before_action :authorize_request

  def plans
    plans = Plan.all
    api_response(
      status_code: :ok,
      message: "Plans successfully fetched",
      data: plans
    )
  end

  def fetch_active_subscription
    subscription = current_organization.active_subscription
    api_response(
      status_code: :ok,
      message: "Subscription successfully fetched",
      data: {
        subscription: subscription
      }
    )
  end

  def pay_subscription
    plan = Plan.find(params[:plan_id])

    base_frontend_url = ENV.fetch("BASE_FRONTEND_URL", "https://website.com")

    session = Stripe::Checkout::Session.create(
      customer_email: current_user.email,
      success_url: base_frontend_url + "/dashboard/projects",
      cancel_url: base_frontend_url + "/dashboard/cancelled",
      payment_method_types: [ "card" ],
      mode: "subscription",
      line_items: [ {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name
          },
          unit_amount: plan.price_in_cents,
          recurring: {
            interval: plan.interval
          }
        },
        quantity: 1
      } ],
      subscription_data: {
        metadata: {
          organization_id: current_organization.public_id,
          plan_id: plan.public_id
        }
      }
    )

    api_response(
      status_code: :ok,
      message: "Checkout session created",
      data: { checkout_url: session.url }
    )
  end

  def cancel
    subscription = current_organization.active_subscription

    Stripe::Subscription.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    )

    subscription.update(status: "cancelled")
    redirect_to subscription_path, notice: "Subscription cancelled successfully"
  end
end
