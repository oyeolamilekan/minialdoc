module ApiSections
  class FetchApiSection < ApplicationService
    attr_accessor :slug

    def initialize(slug:)
      @slug = slug
    end

    def call
      api_section_obj = ApiSection.find_by(slug: slug)
      return [ :error, "Section not found" ] unless api_section_obj
      return [ :error, api_section_obj.errors.full_messages ] unless api_section_obj.persisted?
      [ :success, api_section_obj ]
    end
  end
end
