module Users
  class LoginUser < ApplicationService
    attr_reader :email, :password

    def initialize(email:, password:)
      @email = email
      @password = password
    end

    def call
      user = User.find_by(email: user_params[:email])
      return [ :success, user ] if user && user.authenticate(password)
      [ :failed, "Error in authenticating user" ]
    end
  end
end
