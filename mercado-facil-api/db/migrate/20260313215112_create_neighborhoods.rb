class CreateNeighborhoods < ActiveRecord::Migration[7.2]
  def change
    create_table :neighborhoods do |t|
      t.references :store, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :delivery_fee_cents, default: 0
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :neighborhoods, [:store_id, :name], unique: true
  end
end
