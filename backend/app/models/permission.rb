class Permission < ApplicationRecord
  include HasPublicId

  has_many :plan_permissions
  has_many :plans, through: :plan_permissions

  validates :name, presence: true
  validates :key, presence: true, uniqueness: true
end
