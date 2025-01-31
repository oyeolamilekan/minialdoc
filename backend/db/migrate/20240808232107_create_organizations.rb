class CreateOrganizations < ActiveRecord::Migration[8.0]
  def change
    create_table :organizations do |t|
      t.string :title
      t.string :public_id
      t.string :slug

      t.timestamps
    end
  end
end
