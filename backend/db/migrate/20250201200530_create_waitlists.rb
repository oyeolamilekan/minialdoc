class CreateWaitlists < ActiveRecord::Migration[8.0]
  def change
    create_table :waitlists do |t|
      t.string :email
      t.string :status

      t.timestamps
    end
  end
end
