class UsersController < ApplicationController
  before_action :authorize_request, except: [
    :login,
    :sign_up
  ]

  def sign_up
    is_email_disposable = Utils::EmailCheckerService.call(params[:email])
    return api_error(message: "Invalid email, try using a valid email.", status_code: :unprocessable_entity) if is_email_disposable
    ActiveRecord::Base.transaction do
      status, result = Users::CreateUser.call(user_params: create_user_params)
      return api_error(message: result, status_code: :bad_request) if status == :error
      organization = Organization.create(title: params[:buisness_name])
      result.update!(organization: organization)
      return api_response(status: true, message: "Successfully created user", data: nil, status_code: :created) if status == :success
    end
    api_error(message: user, status_code: :unprocessable_entity)
  end

  def login
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      user_data = user.as_json.merge(token: user.token)
      api_response(status: true, message: "Successfully Logged in", data: user_data, status_code: :ok)
    else
      api_error(message: "Error in authenticating user, kindly check your credentials", status_code: :unprocessable_entity)
    end
  end

  def change_password
    if !current_user.authenticate(change_password_params[:old_password])
      return api_error(message: "Old password don't match.", status_code: :unprocessable_entity)
    end

    if change_password_params[:password] != change_password_params[:password2]
      return api_error(message: "Passwords don't match.", status_code: :unprocessable_entity)
    end

    if current_user.update({ password: change_password_params[:password] })
      return api_response(status: true, message: "User password has been change.", data: nil, status_code: :ok)
    end

    api_error(message: "Failed in changing password", status_code: :unprocessable_entity)
  end

  private
  def create_user_params
    params.permit(:email, :first_name, :last_name, :password)
  end

  def change_password_params
    params.permit(:old_password, :password, :password2)
  end
end
