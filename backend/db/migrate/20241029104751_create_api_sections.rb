class CreateApiSections < ActiveRecord::Migration[8.0]
  def change
    create_table :api_sections do |t|
      t.references :project, null: false, foreign_key: { to_table: :api_projects }
      t.string :title
      t.string :slug
      t.uuid :public_id

      t.timestamps
    end

    add_index :api_sections, :slug
    add_index :api_sections, :public_id, unique: true
    add_index :api_sections, [ :project_id, :slug ], unique: true
  end
end
