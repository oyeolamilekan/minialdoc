class ApiSectionsController < ApplicationController
  before_action :authorize_request, except: [ :fetch_section_endpoints ]
  before_action :check_active_subcription, except: [ :fetch_section_endpoints ]

  def fetch_section_endpoints
    project = ApiProject.find_by(slug: params[:project_slug])
    return api_error(status_code: :not_found, message: "No section found") unless project.present?
    sections_with_endpoints = project.sections.includes(:endpoint).map do |section|
      {
        id: section.id,
        title: section.title,
        slug: section.slug,
        endpoints: section.endpoint.serialize_for_api
      }
    end
    api_response(message: "Section and api endpoint fetched", status_code: :ok, data: sections_with_endpoints)
  end

  def create_section
    project = ApiProject.find_by(slug: params[:project_slug])
    return api_error(status_code: :not_found, message: "No project found") unless project.present?
    section_status, section_result = ApiSections::CreateApiSection.call(title: section_title, project: project)
    return api_error(status_code: :server_error, message: section_result) if section_status != :success
    api_response(message: "Section created", status_code: :created, data: section_result)
  end

  def delete_section
    section_status, section_result = ApiSections::DeleteApiSection.call(slug: params[:section_slug])
    return api_error(message: section_result, status_code: :internal_server_error) if section_status != :success
    api_response(message: "API section deleted", status_code: :no_content)
  end

  def update_section
    section_status, section_result = ApiSections::UpdateApiSection.call(slug: params[:section_slug], section_params: section_params)
    return api_error(message: section_result, status_code: :unprocessable_entity) if section_status != :success
    api_response(status: true, message: "Successfully update project", data: section_result, status_code: :ok)
  end

  private
  def project_slug_param
    params.permit(:project_slug)
  end

  def section_slug_param
    params.permit(:section_slug)
  end

  def section_title
    params.require(:title)
  end

  def section_params
    params.permit(:title)
  end
end
