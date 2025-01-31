class ApiProjectsController < ApplicationController
  before_action :authorize_request, except: [ :fetch_project ]
  before_action :check_active_subcription, except: [ :fetch_project ]

  def projects
    result = current_organization.api_project
    api_response(message: "Api projects fetched", data: result)
  end

  def create_project
    api_project_status, api_project_result = ApiProjects::CreateApiProject.call(
      title: project_params[:title],
      description: project_params[:description],
      base_url: project_params[:base_url],
      organization: current_organization
    )
    return api_error(message: api_project_result, status_code: :internal_server_error) if api_project_status == :error
    api_response(message: "Api project created", data: api_project_result, status_code: :created)
  end

  def delete_project
    api_project_status, api_project_result = ApiProjects::DeleteApiProject.call(slug: params[:slug])
    return api_error(message: api_project_result, status_code: :internal_server_error) if api_project_status == :error
    api_response(message: "API project deleted", status_code: :no_content)
  end

  def update_project
    project_status, project_result = ApiProjects::UpdateApiProject.call(public_id: params[:slug], project_params: project_params)
    return api_error(message: project_result, status_code: :unprocessable_entity) if project_status != :success
    api_response(status: true, message: "Successfully update project", data: project_result, status_code: :ok)
  end

  def fetch_project
    project = ApiProject.find_by(slug: params[:slug])
    api_response(message: "Api project fetched", data: project)
  end

  private
  def project_params
    params.permit(:title, :description, :base_url)
  end
end
