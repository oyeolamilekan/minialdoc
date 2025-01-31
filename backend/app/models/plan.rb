class Plan < ApplicationRecord
  include HasPublicId

  has_many :subscriptions
  has_many :organizations, through: :subscriptions
  has_many :plan_permissions
  has_many :permissions, through: :plan_permissions

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # features stored as jsonb for flexibility
  store_accessor :features, :max_users, :max_projects, :storage_limit

  def price_in_cents
    (price * 100).to_i
  end
end
