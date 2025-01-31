module Users
  class CreateUser < ApplicationService
    attr_reader :user_params

    def initialize(user_params:)
      @user_params = user_params
    end

    def call
      result = User.find_by(email: user_params[:email])
      return [ :error, "User already exists" ] if result.present?
      user_obj = User.create!(user_params)
      [ :success, user_obj ]
    end
  end
end
