module ApiSections
  class DeleteApiSection < ApplicationService
    attr_reader :slug

    def initialize(slug:)
      @slug = slug
    end

    def call
      api_section_obj = ApiSection.find_by(slug: slug)
      return [ :error, "API Section not found" ] unless api_section_obj
      return [ :error, api_section_obj.errors.full_messages ] unless api_section_obj.destroy
      [ :success, api_section_obj ]
    end
  end
end
