class CreateApiEndpoints < ActiveRecord::Migration[8.0]
  def change
    create_table :api_endpoints do |t|
      t.references :section, null: false, foreign_key: { to_table: :api_sections }
      t.references :project, null: false, foreign_key: { to_table: :api_projects }
      t.string :title, limit: 250
      t.string :slug, limit: 260
      t.uuid :public_id
      t.string :endpoint_type, default: 'endpoint'
      t.text :content
      t.text :markdown
      t.json :body, default: {
        method: 'GET',
        path: '',
        description: '',
        parameters: [],
        requestBody: [],
        authHeader: {
          type: 'None',
          key: '',
          value: ''
        },
        sampleResponses: []
      }

      t.timestamps
    end
  end
end
