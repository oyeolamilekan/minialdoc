module ApiProjects
  class UpdateApiProject < ApplicationService
    attr_reader :public_id, :project_params

    def initialize(public_id:, project_params:)
      @public_id = public_id
      @project_params = project_params
    end

    def call
      project_obj = ApiProject.find_by(public_id: public_id)
      return [ :error, "Api Project not found" ] if project_obj.nil?
      return [ :error, project_obj.errors ] unless project_obj.update(project_params)
      [ :success, project_obj ]
    end
  end
end
