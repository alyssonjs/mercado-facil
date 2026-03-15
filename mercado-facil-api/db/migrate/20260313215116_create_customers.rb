class CreateCustomers < ActiveRecord::Migration[7.2]
  def change
    create_table :customers do |t|
      t.references :store, null: false, foreign_key: true
      t.string :name, null: false
      t.string :phone, null: false
      t.string :email
      t.string :address_line, null: false
      t.string :neighborhood, null: false
      t.string :city
      t.string :state
      t.string :zip_code
      t.string :complement
      t.text :notes
      t.string :reference_note

      t.timestamps
    end
    add_index :customers, [:store_id, :phone]
  end
end
