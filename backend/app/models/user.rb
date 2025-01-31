class User < ApplicationRecord
  include HasPublicId
  belongs_to :organization, optional: true

  has_secure_password

  validates_presence_of :email, :password, :first_name, :last_name
  validates_uniqueness_of :email, message: "This user with email already exists"
  validates :email, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  before_save :lowercase
  after_update :expire_cache

  def as_json(options = {})
    super(options.merge({ except: [ :id, :password, :password_digest ] }))
  end

  def update_password(password)
    self.update!(password: password)
  end

  def lowercase
    self.first_name = first_name.downcase
    self.last_name = last_name.downcase
  end

  def expire_cache
    Rails.cache.delete("user/#{self.id}")
  end

  def token
    status, payload = Utils::EncodeJsonWebToken.call(payload: { user_id: self.id })
    payload if status == :success
  end
end
