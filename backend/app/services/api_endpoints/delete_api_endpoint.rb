module ApiEndpoints
  class DeleteApiEndpoint < ApplicationService
    attr_accessor :slug

    def initialize(slug:)
      @slug = slug
    end

    def call
      api_endpoint_obj = ApiEndpoint.find_by(slug: slug)
      return [ :error, "API endpoint not found" ] unless api_endpoint_obj
      return [ :error, api_endpoint_obj.errors.full_messages ] unless api_endpoint_obj.destroy
      [ :success, api_endpoint_obj ]
    end
  end
end
