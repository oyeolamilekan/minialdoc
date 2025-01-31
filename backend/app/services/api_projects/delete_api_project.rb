module ApiProjects
  class DeleteApiProject < ApplicationService
    attr_accessor :slug

    def initialize(slug:)
      @slug = slug
    end

    def call
      api_projects_obj = ApiProject.find_by(slug: slug)
      return [ :error, "API project not found" ] unless api_projects_obj
      return [ :error, api_projects_obj.errors.full_messages ] unless api_projects_obj.destroy
      [ :success, api_projects_obj ]
    end
  end
end
