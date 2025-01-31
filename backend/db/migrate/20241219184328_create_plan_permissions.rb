class CreatePlanPermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :plan_permissions do |t|
      t.uuid :public_id
      t.references :plan, null: false, foreign_key: true
      t.references :permission, null: false, foreign_key: true

      t.timestamps
    end

    add_index :plan_permissions, [ :plan_id, :permission_id ], unique: true
  end
end
