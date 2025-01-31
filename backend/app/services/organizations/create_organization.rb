module Organizations
  class CreateOrganization < ApplicationService
    attr_accessor :current_user, :organization_params

    def initialize(current_user:, organization_params:)
      @current_user = current_user
      @organization_params = organization_params
    end

    def call
      return [ :error, "This member already has an organization" ] if current_user.organization.present?

      organization = Organization.create(organization_params)

      current_user.update(organization: organization)

      if organization.persisted?
        [ :success, organization ]
      else
        [ :error, organization.errors.full_messages.first ]
      end
    end
  end
end
