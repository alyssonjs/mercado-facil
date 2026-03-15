class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |t|
      t.references :store, null: false, foreign_key: true
      t.references :category, null: true, foreign_key: true
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.integer :price_cents, null: false, default: 0
      t.string :sale_type, null: false, default: "unit"
      t.string :unit_type, null: false, default: "un"
      t.integer :stock_quantity, default: 0, null: false
      t.integer :minimum_stock_alert, default: 0
      t.boolean :active, default: true, null: false
      t.boolean :featured, default: false
      t.string :image_url

      t.timestamps
    end
    add_index :products, [:store_id, :slug], unique: true
  end
end
