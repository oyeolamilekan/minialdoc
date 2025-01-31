class CreatePermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :permissions do |t|
      t.uuid :public_id
      t.string :name, null: false
      t.string :key, null: false
      t.text :description

      t.timestamps
    end

    add_index :permissions, :key, unique: true
  end
end
