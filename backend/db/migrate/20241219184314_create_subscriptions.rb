class CreateSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :subscriptions do |t|
      t.uuid :public_id
      t.references :organization, null: false, foreign_key: true
      t.references :plan, null: false, foreign_key: true
      t.string :status, null: false, default: 'pending'
      t.string :stripe_subscription_id, null: false
      t.string :stripe_customer_id, null: false
      t.datetime :start_date, null: false
      t.datetime :end_date, null: false

      t.timestamps
    end

    add_index :subscriptions, [ :organization_id, :status ]
  end
end
