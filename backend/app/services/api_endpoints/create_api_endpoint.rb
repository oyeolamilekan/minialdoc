module ApiEndpoints
  class CreateApiEndpoint < ApplicationService
    attr_reader :endpoint_attributes

    def initialize(endpoint_attributes:)
      @endpoint_attributes = endpoint_attributes
    end

    def call
      api_endpoint_obj = ApiEndpoint.create(endpoint_attributes)
      return [ :error, api_endpoint_obj.errors.objects.first.full_message ] unless api_endpoint_obj.persisted?
      [ :success, api_endpoint_obj ]
    end
  end
end
