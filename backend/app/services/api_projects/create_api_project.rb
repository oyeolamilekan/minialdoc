module ApiProjects
  class CreateApiProject < ApplicationService
    attr_reader :title, :description, :base_url, :organization

    def initialize(title:, description:, base_url:, organization:)
      @title = title
      @base_url = base_url
      @description = description
      @organization = organization
    end

    def call
      api_project_obj = ApiProject.create(title: title, description: description, base_url: base_url, organization: organization)
      return [ :error, api_project_obj.errors.objects.first.full_message ] unless api_project_obj.persisted?
      [ :success, api_project_obj ]
    end
  end
end
