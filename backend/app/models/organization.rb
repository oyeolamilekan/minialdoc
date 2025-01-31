class Organization < ApplicationRecord
  include HasPublicId
  include Slugify

  has_many :subscriptions
  has_one :active_subscription, -> { active }, class_name: "Subscription"
  has_many :plans, through: :subscriptions
  has_many :users, dependent: :destroy
  has_many :api_project
  validates_presence_of :title

  def subscribed?
    active_subscription.present?
  end

  def has_permission?(permission_key)
    return false unless subscribed?
    active_subscription.plan.permissions.exists?(key: permission_key)
  end
end
