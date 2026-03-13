class CreateDeliveries < ActiveRecord::Migration[7.2]
  def change
    create_table :deliveries do |t|
      t.references :store, null: false, foreign_key: true
      t.references :order, null: false, foreign_key: true
      t.references :delivery_user, foreign_key: { to_table: :users }
      t.string :status, null: false, default: "atribuida"
      t.datetime :assigned_at
      t.datetime :left_for_delivery_at
      t.datetime :delivered_at
      t.text :notes

      t.timestamps
    end
    add_index :deliveries, [:store_id, :status]
  end
end
