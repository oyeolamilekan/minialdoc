module ApiProjects
  class FetchApiProjects < ApplicationService
    def initialize
    end

    def call
      api_projects_obj = ApiProject.all
      [ :success, api_projects_obj ]
    end
  end
end
