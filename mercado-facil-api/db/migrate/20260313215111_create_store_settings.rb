class CreateStoreSettings < ActiveRecord::Migration[7.2]
  def change
    create_table :store_settings do |t|
      t.references :store, null: false, foreign_key: true
      t.string :logo_url
      t.string :banner_url
      t.string :primary_color, default: "#16a34a"
      t.integer :minimum_order_cents, default: 0
      t.integer :default_delivery_fee_cents, default: 0
      t.integer :delivery_time_minutes, default: 40
      t.boolean :accepts_cash, default: true
      t.boolean :accepts_pix, default: true
      t.boolean :accepts_card_on_delivery, default: true
      t.string :opening_hours
      t.string :closing_hours
      t.boolean :active, default: true, null: false

      t.timestamps
    end
  end
end
