# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_03_13_215121) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["store_id", "slug"], name: "index_categories_on_store_id_and_slug", unique: true
    t.index ["store_id"], name: "index_categories_on_store_id"
  end

  create_table "customers", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.string "name", null: false
    t.string "phone", null: false
    t.string "email"
    t.string "address_line", null: false
    t.string "neighborhood", null: false
    t.string "city"
    t.string "state"
    t.string "zip_code"
    t.string "complement"
    t.text "notes"
    t.string "reference_note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["store_id", "phone"], name: "index_customers_on_store_id_and_phone"
    t.index ["store_id"], name: "index_customers_on_store_id"
  end

  create_table "deliveries", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.bigint "order_id", null: false
    t.bigint "delivery_user_id"
    t.string "status", default: "atribuida", null: false
    t.datetime "assigned_at"
    t.datetime "left_for_delivery_at"
    t.datetime "delivered_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["delivery_user_id"], name: "index_deliveries_on_delivery_user_id"
    t.index ["order_id"], name: "index_deliveries_on_order_id"
    t.index ["store_id", "status"], name: "index_deliveries_on_store_id_and_status"
    t.index ["store_id"], name: "index_deliveries_on_store_id"
  end

  create_table "neighborhoods", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.string "name", null: false
    t.integer "delivery_fee_cents", default: 0
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["store_id", "name"], name: "index_neighborhoods_on_store_id_and_name", unique: true
    t.index ["store_id"], name: "index_neighborhoods_on_store_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.string "product_name_snapshot", null: false
    t.string "unit_type", null: false
    t.decimal "quantity", precision: 10, scale: 2, default: "1.0", null: false
    t.integer "unit_price_cents", default: 0, null: false
    t.integer "total_price_cents", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.bigint "customer_id", null: false
    t.bigint "created_by_id"
    t.string "source", default: "admin", null: false
    t.string "status", default: "pendente", null: false
    t.string "payment_method", null: false
    t.integer "subtotal_cents", default: 0, null: false
    t.integer "delivery_fee_cents", default: 0, null: false
    t.integer "total_cents", default: 0, null: false
    t.integer "change_for_cents", default: 0
    t.text "notes"
    t.jsonb "delivery_address_snapshot", default: {}
    t.string "neighborhood_snapshot"
    t.datetime "ordered_at"
    t.datetime "confirmed_at"
    t.datetime "delivered_at"
    t.datetime "canceled_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_orders_on_created_by_id"
    t.index ["customer_id"], name: "index_orders_on_customer_id"
    t.index ["ordered_at"], name: "index_orders_on_ordered_at"
    t.index ["store_id", "status"], name: "index_orders_on_store_id_and_status"
    t.index ["store_id"], name: "index_orders_on_store_id"
  end

  create_table "products", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.bigint "category_id"
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.integer "price_cents", default: 0, null: false
    t.string "sale_type", default: "unit", null: false
    t.string "unit_type", default: "un", null: false
    t.integer "stock_quantity", default: 0, null: false
    t.integer "minimum_stock_alert", default: 0
    t.boolean "active", default: true, null: false
    t.boolean "featured", default: false
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["store_id", "slug"], name: "index_products_on_store_id_and_slug", unique: true
    t.index ["store_id"], name: "index_products_on_store_id"
  end

  create_table "stock_movements", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.bigint "product_id", null: false
    t.string "movement_type", null: false
    t.integer "quantity", null: false
    t.string "reference_type"
    t.bigint "reference_id"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_stock_movements_on_product_id"
    t.index ["store_id", "created_at"], name: "index_stock_movements_on_store_id_and_created_at"
    t.index ["store_id"], name: "index_stock_movements_on_store_id"
  end

  create_table "store_settings", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.string "logo_url"
    t.string "banner_url"
    t.string "primary_color", default: "#16a34a"
    t.integer "minimum_order_cents", default: 0
    t.integer "default_delivery_fee_cents", default: 0
    t.integer "delivery_time_minutes", default: 40
    t.boolean "accepts_cash", default: true
    t.boolean "accepts_pix", default: true
    t.boolean "accepts_card_on_delivery", default: true
    t.string "opening_hours"
    t.string "closing_hours"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["store_id"], name: "index_store_settings_on_store_id"
  end

  create_table "stores", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.string "phone"
    t.string "email"
    t.string "address"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_stores_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.bigint "store_id", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "role", default: "attendant", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_reset_token"
    t.datetime "password_reset_sent_at"
    t.index ["password_reset_token"], name: "index_users_on_password_reset_token", unique: true
    t.index ["store_id", "email"], name: "index_users_on_store_id_and_email", unique: true
    t.index ["store_id"], name: "index_users_on_store_id"
  end

  add_foreign_key "categories", "stores"
  add_foreign_key "customers", "stores"
  add_foreign_key "deliveries", "orders"
  add_foreign_key "deliveries", "stores"
  add_foreign_key "deliveries", "users", column: "delivery_user_id"
  add_foreign_key "neighborhoods", "stores"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "customers"
  add_foreign_key "orders", "stores"
  add_foreign_key "orders", "users", column: "created_by_id"
  add_foreign_key "products", "categories"
  add_foreign_key "products", "stores"
  add_foreign_key "stock_movements", "products"
  add_foreign_key "stock_movements", "stores"
  add_foreign_key "store_settings", "stores"
  add_foreign_key "users", "stores"
end
