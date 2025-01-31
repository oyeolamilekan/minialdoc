module ApiSections
  class UpdateApiSection < ApplicationService
    attr_reader :slug, :section_params

    def initialize(slug:, section_params:)
      @slug = slug
      @section_params = section_params
    end

    def call
      api_section_obj = ApiSection.find_by(slug: slug)
      return [ :error, "Api Section not found" ] if api_section_obj.nil?
      return [ :error, api_section_obj.errors ] unless api_section_obj.update(section_params)
      [ :success, api_section_obj ]
    end
  end
end
