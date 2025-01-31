class CreateApiProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :api_projects do |t|
      t.string :title
      t.string :base_url
      t.text :description
      t.string :slug
      t.uuid :public_id
      t.references :organization, null: true, foreign_key: true

      t.timestamps
    end

    add_index :api_projects, :slug
    add_index :api_projects, :title
    add_index :api_projects, [ :public_id, :slug ], unique: true
  end
end
