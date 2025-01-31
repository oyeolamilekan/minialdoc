class PlanPermission < ApplicationRecord
  include HasPublicId

  belongs_to :plan
  belongs_to :permission
end
