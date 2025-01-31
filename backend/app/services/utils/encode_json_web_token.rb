module Utils
  class EncodeJsonWebToken < ApplicationService
    attr_reader :payload

    SECRET_KEY = ENV["SECRET_KEY_BASE"]

    def initialize(payload:)
      @payload = payload
    end

    def call
      payload[:exp] = 24.hours.from_now.to_i
      token = JWT.encode(payload, SECRET_KEY)
      [ :success, token ]
    end
  end
end
