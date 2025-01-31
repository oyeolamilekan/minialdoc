module ApiEndpoints
  class FetchApiEndpoint < ApplicationService
    attr_reader :slug

    def initialize(slug:)
      @slug = slug
    end

    def call
      api_endpoint_obj = ApiEndpoint.find_by(slug: slug)
      [ :success, api_endpoint_obj ]
    end
  end
end
