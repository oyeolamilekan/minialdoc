class OrganizationsController < ApplicationController
  before_action :authorize_request

  def create_organization
    # Use the CreateOrganization service to handle organization creation
    result = Organizations::CreateOrganization.call(
      current_user: current_user,
      organization_params: permitted_organization_params
    )

    # Guard clause to handle unsuccessful organization creation
    return api_error(
      message: result.last,
      status_code: :unprocessable_entity
    ) unless result.first == :success

    # Successful organization creation
    api_response(
      message: "Organization created successfully",
      data: result.last, # The created organization
      status_code: :created
    )
  end

  def fetch_users
    organization = Organization.find_by(public_id: params[:public_id])
    return api_error(status_code: :not_found, message: "Organization failed") unless organization.present?
    api_response(status_code: :ok, message: "Organization found", data: organization.users)
  end

  private
  def permitted_organization_params
    params.permit(:title)
  end
end
