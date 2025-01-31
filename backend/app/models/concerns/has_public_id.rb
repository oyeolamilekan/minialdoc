module HasPublicId
  extend ActiveSupport::Concern

  included do
    before_create :set_public_id
    validates :public_id, uniqueness: true
  end

  private

  def set_public_id
    self.public_id = SecureRandom.uuid
  end
end
