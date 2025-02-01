class WaitlistsController < ApplicationController
  skip_before_action :authorize_request

  def create
    # Check if email is disposable
    is_email_disposable = Utils::EmailCheckerService.call(waitlist_params[:email])
    return api_error(
      message: "Please use a valid email address.", 
      status_code: :unprocessable_entity
    ) if is_email_disposable

    # Create waitlist entry
    waitlist = Waitlist.new(waitlist_params)
    
    if waitlist.save
      api_response(
        status: true,
        message: "Successfully joined the waitlist!",
        status_code: :created
      )
    else
      api_error(
        message: waitlist.errors.full_messages.join(", "),
        status_code: :unprocessable_entity
      )
    end
  end

  private

  def waitlist_params
    params.permit(:email)
  end
end 