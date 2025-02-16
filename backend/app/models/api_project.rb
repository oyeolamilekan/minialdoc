class ApiProject < ApplicationRecord
  include HasPublicId
  include Slugify

  validates :title, presence: true, length: { maximum: 250 }
  validates :description, presence: true
  belongs_to :organization

  validates :base_url, presence: true, length: { maximum: 250 }, format: {
    with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
    message: "must be a valid URL starting with http:// or https://"
  }

  has_many :sections, class_name: 'ApiSection', foreign_key: 'project_id'
  has_many :endpoint, class_name: "ApiEndpoint", foreign_key: "project_id", dependent: :destroy
end
