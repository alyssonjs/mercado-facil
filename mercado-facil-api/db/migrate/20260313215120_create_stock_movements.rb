class CreateStockMovements < ActiveRecord::Migration[7.2]
  def change
    create_table :stock_movements do |t|
      t.references :store, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.string :movement_type, null: false
      t.integer :quantity, null: false
      t.string :reference_type
      t.bigint :reference_id
      t.text :notes

      t.timestamps
    end
    add_index :stock_movements, [:store_id, :created_at]
  end
end
