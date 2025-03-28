class ApiSection < ApplicationRecord
  include HasPublicId
  include Slugify

  belongs_to :project, class_name: "ApiProject", dependent: :destroy
  has_many :endpoint, class_name: "ApiEndpoint", foreign_key: "section_id", dependent: :destroy
end
