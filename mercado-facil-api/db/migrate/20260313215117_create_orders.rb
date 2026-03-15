class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.references :store, null: false, foreign_key: true
      t.references :customer, null: false, foreign_key: true
      t.references :created_by, foreign_key: { to_table: :users }
      t.string :source, null: false, default: "admin"
      t.string :status, null: false, default: "pendente"
      t.string :payment_method, null: false
      t.integer :subtotal_cents, null: false, default: 0
      t.integer :delivery_fee_cents, null: false, default: 0
      t.integer :total_cents, null: false, default: 0
      t.integer :change_for_cents, default: 0
      t.text :notes
      t.jsonb :delivery_address_snapshot, default: {}
      t.string :neighborhood_snapshot
      t.datetime :ordered_at
      t.datetime :confirmed_at
      t.datetime :delivered_at
      t.datetime :canceled_at

      t.timestamps
    end
    add_index :orders, [:store_id, :status]
    add_index :orders, :ordered_at
  end
end
