class CreateStores < ActiveRecord::Migration[7.2]
  def change
    create_table :stores do |t|
      t.string :name
      t.string :slug
      t.string :phone
      t.string :email
      t.string :address
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :stores, :slug, unique: true
  end
end
