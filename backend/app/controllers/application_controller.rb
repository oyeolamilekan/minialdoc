class ApplicationController < ActionController::API
  attr_reader :current_user, :current_organization

  def check_active_subcription
    return true
    # api_error(
    #   status_code: :payment_required,
    #   message: "Your organization does not have an active subscription"
    # ) unless current_organization.subscribed?
  end

  def authorize_request
    header = request.headers["Authorization"]
    header = header.split(" ").last if header
    begin
      @decoded = Utils::DecodeJsonWebToken.call(token: header)
      @current_user = Rails.cache.fetch("user/#{@decoded[:user_id]}") do
        User.find(@decoded[:user_id])
      end
      @current_organization = @current_user.organization
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error(e)
      render json: { status: false, message: "Invalid token", data: nil }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.error(e)
      render json: { status: false, message: "Invalid token", data: nil }, status: :unauthorized
    end
  end

  def api_response(status: true, message:, data: nil, status_code: nil, meta: nil)
    response = {
      status: status,
      message: message,
      data: data
    }

    response[:meta] = meta if meta.present?

    render json: response, status: status_code || :ok
  end

  def api_error(status_code: nil, message:)
    api_response(status: false, message: message, data: nil, status_code: status_code)
  end

  def render_error_response(exception)
    Rails.logger.error("An exception occurred: #{exception.message}")

    if Rails.env.production?
        api_response(status: false, message: "500 server error.", data: nil, status_code: :internal_server_error)
    else
        raise exception
    end
  end
end
