class ApiEndpoint < ApplicationRecord
  include HasPublicId
  include Slugify

  belongs_to :section, class_name: "ApiSection", dependent: :destroy
  belongs_to :project, class_name: "ApiProject", dependent: :destroy

  scope :with_method, -> {
    select("api_endpoints.*, body->>'method' as method")
  }

  ALLOWED_OPTIONS = ['endpoint', 'doc'].freeze
  
  validates :endpoint_type, inclusion: { 
    in: ALLOWED_OPTIONS
  }

  before_create :set_default_type

  def self.serialize_for_api
    with_method.map do |endpoint|
      {
        id: endpoint.id,
        title: endpoint.title,
        slug: endpoint.slug,
        method: endpoint[:method],
        endpoint_type: endpoint.endpoint_type
      }
    end
  end

  private
  def set_default_type
    self.endpoint_type ||= 'doc'
  end
end
