class CreatePlans < ActiveRecord::Migration[7.0]
  def change
    create_table :plans do |t|
      t.uuid :public_id
      t.string :name, null: false
      t.text :description
      t.boolean :recommended, default: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :interval, null: false
      t.jsonb :features, default: {}

      t.timestamps
    end
  end
end
