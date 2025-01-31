class ApiEndpointsController < ApplicationController
  before_action :authorize_request, except: [ :fetch_endpoint ]
  before_action :check_active_subcription, except: [ :fetch_endpoint ]

  def fetch_endpoint
    endpoint = ApiEndpoint.find_by(slug: endpoint_slug)
    return api_response(status: false, message: "Endpoint does not exit.", data: nil, status_code: :not_found) unless endpoint.present?
    api_response(status: true, message: "Products successfully retrieved", data: endpoint)
  end

  def delete_endpoint
    endpoint_status, endpoint_result = ApiEndpoints::DeleteApiEndpoint.call(slug: endpoint_slug)
    return api_response(status: false, message: endpoint_result, data: nil, status_code: :not_found) if endpoint_status == :error
    api_response(status: true, message: "Products successfully retrieved", data: endpoint_result)
  end

  def create_endpoint
    project = ApiProject.find_by(slug: project_slug)
    return api_error(status_code: :not_found, message: "Project does not exist") unless project.present?
    section_status, section_result = ApiSections::FetchApiSection.call(slug: section_slug)
    return api_error(status_code: :not_found, message: section_result) if section_status != :success
    endpoint_payload = endpoint_params.merge(project: project, section: section_result)
    endpoint_status, endpoint_result = ApiEndpoints::CreateApiEndpoint.call(endpoint_attributes: endpoint_payload)
    return api_error(status_code: :not_found, message: section_result) if endpoint_status != :success
    api_response(status: true, message: "Endpoint successfully created", data: endpoint_result)
  end

  def update_endpoint
    endpoint_status, endpoint_result = ApiEndpoints::UpdateApiEndpoint.call(slug: endpoint_slug, endpoint_params: endpoint_params)
    return api_error(message: endpoint_result, status_code: :unprocessable_entity) if endpoint_status != :success
    api_response(status: true, message: "Successfully update project", data: endpoint_result, status_code: :ok)
  end

  private
  def endpoint_params
    params.permit(:title, :content, :markdown_content, :endpoint_type, body: {})
  end

  def endpoint_slug
    params.require(:endpoint_slug)
  end

  def section_slug
    params.require(:section_slug)
  end

  def project_slug
    params.require(:project_slug)
  end
end
