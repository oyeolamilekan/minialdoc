class Subscription < ApplicationRecord
  include HasPublicId

  belongs_to :organization
  belongs_to :plan

  validates :start_date, presence: true
  validates :status, presence: true, inclusion: {
    in: %w[incomplete incomplete_expired trialing active past_due canceled unpaid paused]
  }
  before_validation :set_end_date, on: :create

  scope :active, -> { where(status: "active").where("end_date > ?", Time.current) }

  def active?
    status == "active" && end_date > Time.current
  end

  def expired?
    end_date < Time.current
  end

  def days_remaining
    ((end_date - Time.current) / 1.day).to_i
  end

  def as_json(options = {})
    super(options.merge(
      include: { plan: { except: [ :id ] } },
      except: [ :id, :organization_id, :stripe_subscription_id, :stripe_customer_id ]
    ))
  end

  private

  def set_end_date
    self.end_date ||= start_date + 1.month
  end
end
