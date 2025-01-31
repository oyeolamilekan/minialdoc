module Utils
  class GenerateRandomString < ApplicationService
    attr_reader :length

    def initialize(length)
      @length = length
    end

    def call
      charset = Array("A".."Z") + Array("a".."z") + Array("0".."9")
      Array.new(@length) { charset.sample }.join
    end
  end
end
