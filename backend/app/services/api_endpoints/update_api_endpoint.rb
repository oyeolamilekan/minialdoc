module ApiEndpoints
  class UpdateApiEndpoint < ApplicationService
    attr_reader :slug, :endpoint_params

    def initialize(slug:, endpoint_params:)
      @slug = slug
      @endpoint_params = endpoint_params
    end

    def call
      api_endpoints_obj = ApiEndpoint.find_by(slug: slug)
      return [ :error, "Api Endpoint not found" ] if api_endpoints_obj.nil?
      return [ :error, api_endpoints_obj.errors ] unless api_endpoints_obj.update(endpoint_params)
      [ :success, api_endpoints_obj ]
    end
  end
end
