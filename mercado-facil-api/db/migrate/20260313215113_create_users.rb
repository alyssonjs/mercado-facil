class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.references :store, null: false, foreign_key: true
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :role, null: false, default: "attendant"
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :users, [:store_id, :email], unique: true
  end
end
