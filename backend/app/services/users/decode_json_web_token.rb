module Users
  class DecodeJsonWebToken < ApplicationService
    attr_reader :token

    SECRET_KEY = ENV.fetch("SECRET_KEY_BASE")

    def initialize(token:)
      @token = token
    end

    def call
      decoded = JWT.decode(token, SECRET_KEY)[0]
      HashWithIndifferentAccess.new decoded
    end
  end
end
