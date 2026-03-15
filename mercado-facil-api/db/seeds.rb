# frozen_string_literal: true

Store.destroy_all

store = Store.create!(
  name: "Mercado Boa Vista",
  slug: "mercado-boa-vista",
  phone: "(11) 3456-7890",
  email: "contato@mercadoboavista.com",
  address: "Rua das Palmeiras, 320 - Vila Nova, SP",
  active: true
)

store.create_store_setting!(
  logo_url: "",
  banner_url: "https://images.unsplash.com/photo-1617708794505-b61d88b32f34",
  primary_color: "#16a34a",
  minimum_order_cents: 3000,
  default_delivery_fee_cents: 500,
  delivery_time_minutes: 40,
  accepts_cash: true,
  accepts_pix: true,
  accepts_card_on_delivery: true,
  opening_hours: "07:00",
  closing_hours: "22:00",
  active: true
)

%w[Vila\ Nova Jardim\ America Centro Boa\ Vista Santa\ Cruz].each do |name|
  fee = { "Vila Nova" => 300, "Jardim America" => 450, "Centro" => 500, "Boa Vista" => 350, "Santa Cruz" => 600 }[name]
  store.neighborhoods.create!(name: name, delivery_fee_cents: fee, active: true)
end

admin = store.users.create!(
  name: "Admin",
  email: "admin@mercado.com",
  password: "123456",
  role: "admin",
  active: true
)

store.users.create!(name: "Atendente", email: "atendente@mercado.com", password: "123456", role: "attendant", active: true)
store.users.create!(name: "Entregador", email: "entregador@mercado.com", password: "123456", role: "delivery", active: true)

%w[Frutas Verduras\ e\ Legumes Carnes Laticinios Padaria Graos\ e\ Cereais Bebidas Mercearia Limpeza].each do |name|
  store.categories.create!(name: name, slug: name.parameterize, active: true)
end

cat_frutas = store.categories.find_by(slug: "frutas")
cat_mercearia = store.categories.find_by(slug: "mercearia")
store.products.create!(
  category: cat_frutas,
  name: "Banana Prata (kg)",
  slug: "banana-prata-kg",
  description: "Banana prata fresca",
  price_cents: 599,
  sale_type: "weight",
  unit_type: "kg",
  stock_quantity: 80,
  minimum_stock_alert: 20,
  active: true,
  featured: true,
  image_url: "https://images.unsplash.com/photo-1573828235229-fb27fdc8da91"
)
store.products.create!(
  category: cat_mercearia,
  name: "Arroz Branco (5kg)",
  slug: "arroz-branco-5kg",
  description: "Arroz tipo 1",
  price_cents: 2490,
  sale_type: "unit",
  unit_type: "un",
  stock_quantity: 50,
  minimum_stock_alert: 15,
  active: true,
  featured: true,
  image_url: "https://images.unsplash.com/photo-1686820740687-426a7b9b2043"
)
store.products.create!(
  category: cat_mercearia,
  name: "Leite Integral (1L)",
  slug: "leite-integral-1l",
  description: "Leite UHT",
  price_cents: 549,
  sale_type: "unit",
  unit_type: "un",
  stock_quantity: 60,
  minimum_stock_alert: 20,
  active: true,
  featured: true
)

c1 = store.customers.create!(name: "Maria da Silva", phone: "(11) 98765-4321", address_line: "Rua das Flores, 123", neighborhood: "Vila Nova")
c2 = store.customers.create!(name: "Joao Santos", phone: "(11) 91234-5678", address_line: "Av. Brasil, 456", neighborhood: "Jardim America")

p1 = store.products.find_by(slug: "banana-prata-kg")
p2 = store.products.find_by(slug: "leite-integral-1l")
o1 = store.orders.create!(
  customer: c1,
  created_by: admin,
  source: "marketplace",
  status: "pendente",
  payment_method: "PIX",
  subtotal_cents: 0,
  delivery_fee_cents: 300,
  total_cents: 0,
  notes: "",
  neighborhood_snapshot: "Vila Nova",
  delivery_address_snapshot: { "address" => "Rua das Flores, 123" },
  ordered_at: Time.current
)
o1.order_items.create!(product: p1, product_name_snapshot: p1.name, unit_type: p1.unit_type, quantity: 2, unit_price_cents: p1.price_cents, total_price_cents: 1198)
o1.order_items.create!(product: p2, product_name_snapshot: p2.name, unit_type: p2.unit_type, quantity: 1, unit_price_cents: p2.price_cents, total_price_cents: 549)
o1.update_totals!

puts "Seeds OK. Login: admin@mercado.com / 123456"
