module ApiSections
  class CreateApiSection < ApplicationService
    attr_reader :title, :project

    def initialize(title:, project:)
      @title = title
      @project = project
    end

    def call
      api_section_obj = ApiSection.create(title: title, project: project)
      return [ :error, api_section_obj.errors.objects.first.full_message ] unless api_section_obj.persisted?
      [ :success, api_section_obj ]
    end
  end
end
