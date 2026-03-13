// Mock data for Mercado Fácil SaaS — Supermarket Demo

export interface StoreSettings {
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
  bannerUrl: string;
  primaryColor: string;
  minimumOrderCents: number;
  defaultDeliveryFeeCents: number;
  deliveryTimeMinutes: number;
  acceptsCash: boolean;
  acceptsPix: boolean;
  acceptsCardOnDelivery: boolean;
  openingHours: string;
  closingHours: string;
  active: boolean;
}

export interface Neighborhood {
  id: string;
  name: string;
  deliveryFee: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  saleType: "unit" | "weight";
  unitType: string;
  stock: number;
  minStock: number;
  active: boolean;
  featured: boolean;
  description: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood: string;
  complement?: string;
  notes: string;
  totalOrders: number;
  lastOrder: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
}

export type OrderStatus =
  | "pendente"
  | "confirmado"
  | "em_separacao"
  | "pronto_entrega"
  | "saiu_entrega"
  | "entregue"
  | "cancelado";

export type OrderSource = "admin" | "marketplace";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  source: OrderSource;
  notes: string;
  address: string;
  neighborhood: string;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
}

export type DeliveryStatus =
  | "atribuida"
  | "saiu_entrega"
  | "entregue"
  | "cancelada";

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  neighborhood: string;
  deliveryPerson: string;
  status: DeliveryStatus;
  assignedAt: string;
  deliveredAt?: string;
  notes: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "saida" | "ajuste";
  quantity: number;
  reason: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Store settings
export const storeSettings: StoreSettings = {
  name: "Mercado Boa Vista",
  slug: "mercado-boa-vista",
  phone: "(11) 3456-7890",
  email: "contato@mercadoboavista.com",
  address: "Rua das Palmeiras, 320 - Vila Nova, SP",
  logoUrl: "",
  bannerUrl: "https://images.unsplash.com/photo-1617708794505-b61d88b32f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcm1hcmtldCUyMGdyb2NlcnklMjBzdG9yZSUyMGJhbm5lcnxlbnwxfHx8fDE3NzM0MzM2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  primaryColor: "#16a34a",
  minimumOrderCents: 3000,
  defaultDeliveryFeeCents: 500,
  deliveryTimeMinutes: 40,
  acceptsCash: true,
  acceptsPix: true,
  acceptsCardOnDelivery: true,
  openingHours: "07:00",
  closingHours: "22:00",
  active: true,
};

// Neighborhoods
export const neighborhoods: Neighborhood[] = [
  { id: "n1", name: "Vila Nova", deliveryFee: 3.00, active: true },
  { id: "n2", name: "Jardim America", deliveryFee: 4.50, active: true },
  { id: "n3", name: "Centro", deliveryFee: 5.00, active: true },
  { id: "n4", name: "Boa Vista", deliveryFee: 3.50, active: true },
  { id: "n5", name: "Santa Cruz", deliveryFee: 6.00, active: true },
  { id: "n6", name: "Industrial", deliveryFee: 8.00, active: false },
];

export const categories = [
  "Frutas",
  "Verduras e Legumes",
  "Carnes",
  "Laticinios",
  "Padaria",
  "Graos e Cereais",
  "Bebidas",
  "Mercearia",
  "Limpeza",
];

export const products: Product[] = [
  // Frutas
  { id: "p1", name: "Banana Prata (kg)", slug: "banana-prata-kg", category: "Frutas", price: 5.99, saleType: "weight", unitType: "kg", stock: 80, minStock: 20, active: true, featured: true, description: "Banana prata fresca, madura na medida certa", imageUrl: "https://images.unsplash.com/photo-1573828235229-fb27fdc8da91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJhbmFuYXMlMjBmcnVpdHxlbnwxfHx8fDE3NzM0MzM2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p2", name: "Maca Fuji (kg)", slug: "maca-fuji-kg", category: "Frutas", price: 9.90, saleType: "weight", unitType: "kg", stock: 50, minStock: 15, active: true, featured: true, description: "Maca fuji crocante e doce, selecao premium", imageUrl: "https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZSUyMGZydWl0JTIwZnJlc2h8ZW58MXx8fHwxNzczNDMzNjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p3", name: "Laranja Pera (kg)", slug: "laranja-pera-kg", category: "Frutas", price: 4.49, saleType: "weight", unitType: "kg", stock: 100, minStock: 25, active: true, featured: false, description: "Laranja pera suculenta, otima para suco", imageUrl: "https://images.unsplash.com/photo-1668617596950-a18f6a720c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yYW5nZSUyMGNpdHJ1cyUyMGZydWl0fGVufDF8fHx8MTc3MzQyMTcxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Verduras e Legumes
  { id: "p4", name: "Tomate Italiano (kg)", slug: "tomate-italiano-kg", category: "Verduras e Legumes", price: 7.99, saleType: "weight", unitType: "kg", stock: 60, minStock: 15, active: true, featured: true, description: "Tomate italiano firme e vermelho, ideal para molhos", imageUrl: "https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBmcmVzaCUyMHJlZCUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzM0Mjk3NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p5", name: "Alface Crespa (un)", slug: "alface-crespa-un", category: "Verduras e Legumes", price: 3.49, saleType: "unit", unitType: "un", stock: 40, minStock: 10, active: true, featured: false, description: "Alface crespa fresca, colhida do dia", imageUrl: "https://images.unsplash.com/photo-1720404342566-9e3fde0b8ee3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZXR0dWNlJTIwZ3JlZW4lMjBzYWxhZCUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzM0MzM2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p6", name: "Cebola (kg)", slug: "cebola-kg", category: "Verduras e Legumes", price: 5.49, saleType: "weight", unitType: "kg", stock: 70, minStock: 20, active: true, featured: false, description: "Cebola branca nacional de primeira qualidade", imageUrl: "https://images.unsplash.com/photo-1711183290225-78a7880000ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmlvbiUyMHZlZ2V0YWJsZSUyMGNvb2tpbmd8ZW58MXx8fHwxNzczNDMzNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p7", name: "Batata Lavada (kg)", slug: "batata-lavada-kg", category: "Verduras e Legumes", price: 6.99, saleType: "weight", unitType: "kg", stock: 90, minStock: 25, active: true, featured: false, description: "Batata lavada selecionada, tamanho uniforme", imageUrl: "https://images.unsplash.com/photo-1744659751904-3b2e5c095323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjB2ZWdldGFibGUlMjBmcmVzaHxlbnwxfHx8fDE3NzM0MzM2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Carnes
  { id: "p8", name: "Peito de Frango (kg)", slug: "peito-frango-kg", category: "Carnes", price: 18.90, saleType: "weight", unitType: "kg", stock: 30, minStock: 10, active: true, featured: true, description: "Peito de frango sem osso e sem pele, resfriado", imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0JTIwcmF3JTIwbWVhdHxlbnwxfHx8fDE3NzMzNDA2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p9", name: "Carne Moida (kg)", slug: "carne-moida-kg", category: "Carnes", price: 29.90, saleType: "weight", unitType: "kg", stock: 25, minStock: 8, active: true, featured: false, description: "Carne moida de primeira, ideal para refogados", imageUrl: "https://images.unsplash.com/photo-1659612527352-64b5e0026138?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmQlMjBiZWVmJTIwcmF3JTIwbWVhdHxlbnwxfHx8fDE3NzM0Mjg5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Laticinios
  { id: "p10", name: "Leite Integral (1L)", slug: "leite-integral-1l", category: "Laticinios", price: 5.49, saleType: "unit", unitType: "un", stock: 60, minStock: 20, active: true, featured: true, description: "Leite integral UHT, caixa 1 litro", imageUrl: "https://images.unsplash.com/photo-1553301803-768cd4a59b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMG1pbGslMjBjYXJ0b24lMjBkYWlyeXxlbnwxfHx8fDE3NzM0MzM2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p11", name: "Ovos (duzia)", slug: "ovos-duzia", category: "Laticinios", price: 12.90, saleType: "unit", unitType: "un", stock: 40, minStock: 15, active: true, featured: true, description: "Ovos frescos caipira, cartela com 12 unidades", imageUrl: "https://images.unsplash.com/photo-1660224286794-fc173fa9295c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwY2FydG9uJTIwZG96ZW58ZW58MXx8fHwxNzczMzQyNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p12", name: "Iogurte Natural (170g)", slug: "iogurte-natural-170g", category: "Laticinios", price: 3.99, saleType: "unit", unitType: "un", stock: 45, minStock: 12, active: true, featured: false, description: "Iogurte natural integral, pote 170g", imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBjdXBzJTIwZGFpcnklMjBzdHJhd2JlcnJ5fGVufDF8fHx8MTc3MzQzMzY2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Padaria
  { id: "p13", name: "Pao de Forma (500g)", slug: "pao-forma-500g", category: "Padaria", price: 7.49, saleType: "unit", unitType: "un", stock: 35, minStock: 10, active: true, featured: false, description: "Pao de forma macio integral, fatiado", imageUrl: "https://images.unsplash.com/photo-1636378126357-7e5f200771c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBicmVhZCUyMGxvYWYlMjBiYWtlcnl8ZW58MXx8fHwxNzczNDMzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Graos e Cereais
  { id: "p14", name: "Arroz Branco (5kg)", slug: "arroz-branco-5kg", category: "Graos e Cereais", price: 24.90, saleType: "unit", unitType: "un", stock: 50, minStock: 15, active: true, featured: true, description: "Arroz branco tipo 1, pacote 5kg", imageUrl: "https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2UlMjBiYWclMjBncmFpbnxlbnwxfHx8fDE3NzM0MzM2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p15", name: "Feijao Preto (1kg)", slug: "feijao-preto-1kg", category: "Graos e Cereais", price: 8.90, saleType: "unit", unitType: "un", stock: 55, minStock: 15, active: true, featured: true, description: "Feijao preto selecionado, pacote 1kg", imageUrl: "https://images.unsplash.com/photo-1767911503405-c7cfcf67bcd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJlYW5zJTIwZHJ5JTIwbGVndW1lc3xlbnwxfHx8fDE3NzM0MzM2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p16", name: "Macarrao Espaguete (500g)", slug: "macarrao-espaguete-500g", category: "Graos e Cereais", price: 4.99, saleType: "unit", unitType: "un", stock: 65, minStock: 20, active: true, featured: false, description: "Macarrao espaguete com ovos, pacote 500g", imageUrl: "https://images.unsplash.com/photo-1751182471056-ecd29a41f339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBwYXN0YSUyMGRyeSUyMGl0YWxpYW58ZW58MXx8fHwxNzczNDMzNjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Bebidas
  { id: "p17", name: "Refrigerante Cola (2L)", slug: "refrigerante-cola-2l", category: "Bebidas", price: 8.99, saleType: "unit", unitType: "un", stock: 70, minStock: 20, active: true, featured: false, description: "Refrigerante sabor cola, garrafa 2 litros", imageUrl: "https://images.unsplash.com/photo-1734773005516-87c5e55ae1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwY29sYSUyMHNvZGElMjBib3R0bGUlMjBiZXZlcmFnZXxlbnwxfHx8fDE3NzM0MzM2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p18", name: "Agua Mineral (1.5L)", slug: "agua-mineral-1-5l", category: "Bebidas", price: 2.99, saleType: "unit", unitType: "un", stock: 100, minStock: 30, active: true, featured: false, description: "Agua mineral sem gas, garrafa 1.5 litros", imageUrl: "https://images.unsplash.com/photo-1564919415179-752ca9dadcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMG1pbmVyYWwlMjBkcmlua3xlbnwxfHx8fDE3NzM0MzM2NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Mercearia
  { id: "p19", name: "Oleo de Soja (900ml)", slug: "oleo-soja-900ml", category: "Mercearia", price: 7.99, saleType: "unit", unitType: "un", stock: 45, minStock: 12, active: true, featured: false, description: "Oleo de soja refinado, garrafa 900ml", imageUrl: "https://images.unsplash.com/photo-1760368104122-2d7917d9f8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwb2lsJTIwdmVnZXRhYmxlJTIwYm90dGxlfGVufDF8fHx8MTc3MzQzMzY2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p20", name: "Acucar Cristal (1kg)", slug: "acucar-cristal-1kg", category: "Mercearia", price: 5.49, saleType: "unit", unitType: "un", stock: 55, minStock: 15, active: true, featured: false, description: "Acucar cristal especial, pacote 1kg", imageUrl: "https://images.unsplash.com/photo-1641679103706-fc8542e2a97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhciUyMHBhY2thZ2UlMjB3aGl0ZSUyMGdyYW51bGF0ZWR8ZW58MXx8fHwxNzczNDMzNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p21", name: "Cafe em Po (500g)", slug: "cafe-po-500g", category: "Mercearia", price: 16.90, saleType: "unit", unitType: "un", stock: 30, minStock: 10, active: true, featured: true, description: "Cafe torrado e moido extra forte, pacote 500g", imageUrl: "https://images.unsplash.com/photo-1756460134962-a2890033b968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwb3dkZXIlMjBncm91bmQlMjBiYWd8ZW58MXx8fHwxNzczNDMzNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "p22", name: "Molho de Tomate (340g)", slug: "molho-tomate-340g", category: "Mercearia", price: 3.99, saleType: "unit", unitType: "un", stock: 3, minStock: 10, active: true, featured: false, description: "Molho de tomate tradicional, sachê 340g", imageUrl: "https://images.unsplash.com/photo-1650568129208-dcf2382d74c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uZWQlMjB0b21hdG8lMjBzYXVjZXxlbnwxfHx8fDE3NzM0MzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },

  // Limpeza
  { id: "p23", name: "Detergente Neutro (500ml)", slug: "detergente-neutro-500ml", category: "Limpeza", price: 2.49, saleType: "unit", unitType: "un", stock: 50, minStock: 15, active: true, featured: false, description: "Detergente liquido neutro, frasco 500ml", imageUrl: "https://images.unsplash.com/photo-1758887262204-a49092d85f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXRlcmdlbnQlMjBjbGVhbmluZyUyMHByb2R1Y3RzJTIwaG91c2Vob2xkfGVufDF8fHx8MTc3MzQzMzY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

export const customers: Customer[] = [
  { id: "c1", name: "Maria da Silva", phone: "(11) 98765-4321", address: "Rua das Flores, 123", neighborhood: "Vila Nova", notes: "", totalOrders: 32, lastOrder: "2026-03-13" },
  { id: "c2", name: "Joao Santos", phone: "(11) 91234-5678", address: "Av. Brasil, 456", neighborhood: "Jardim America", notes: "Prefere entrega de manha", totalOrders: 18, lastOrder: "2026-03-12" },
  { id: "c3", name: "Ana Oliveira", phone: "(11) 99876-5432", address: "Rua Sao Paulo, 789", neighborhood: "Centro", notes: "", totalOrders: 45, lastOrder: "2026-03-13" },
  { id: "c4", name: "Carlos Pereira", phone: "(11) 92345-6789", address: "Rua Minas Gerais, 321", neighborhood: "Boa Vista", notes: "Cliente VIP - compra semanal", totalOrders: 67, lastOrder: "2026-03-11" },
  { id: "c5", name: "Fernanda Lima", phone: "(11) 93456-7890", address: "Rua Rio de Janeiro, 654", neighborhood: "Vila Nova", notes: "", totalOrders: 12, lastOrder: "2026-03-10" },
  { id: "c6", name: "Roberto Souza", phone: "(11) 94567-8901", address: "Av. Paulista, 1000", neighborhood: "Jardim America", notes: "Intolerante a lactose", totalOrders: 23, lastOrder: "2026-03-13" },
  { id: "c7", name: "Lucia Costa", phone: "(11) 95678-9012", address: "Rua Bahia, 234", neighborhood: "Centro", notes: "", totalOrders: 8, lastOrder: "2026-03-09" },
  { id: "c8", name: "Pedro Alves", phone: "(11) 96789-0123", address: "Rua Parana, 567", neighborhood: "Boa Vista", notes: "", totalOrders: 29, lastOrder: "2026-03-12" },
  { id: "c9", name: "Juliana Martins", phone: "(11) 97890-1234", address: "Rua Goias, 890", neighborhood: "Vila Nova", notes: "Sempre compra frutas frescas", totalOrders: 41, lastOrder: "2026-03-13" },
  { id: "c10", name: "Marcos Ribeiro", phone: "(11) 98901-2345", address: "Rua Ceara, 111", neighborhood: "Jardim America", notes: "", totalOrders: 15, lastOrder: "2026-03-08" },
];

export const orders: Order[] = [
  {
    id: "ORD-001", customerId: "c1", customerName: "Maria da Silva",
    items: [
      { productId: "p1", productName: "Banana Prata (kg)", quantity: 2, unitPrice: 5.99, totalPrice: 11.98, unitType: "kg" },
      { productId: "p10", productName: "Leite Integral (1L)", quantity: 3, unitPrice: 5.49, totalPrice: 16.47, unitType: "un" },
      { productId: "p13", productName: "Pao de Forma (500g)", quantity: 1, unitPrice: 7.49, totalPrice: 7.49, unitType: "un" },
    ],
    subtotal: 35.94, deliveryFee: 3.00, total: 38.94, paymentMethod: "PIX", status: "entregue", source: "marketplace",
    notes: "", address: "Rua das Flores, 123", neighborhood: "Vila Nova", createdAt: "2026-03-13T08:30:00", deliveredAt: "2026-03-13T09:45:00",
  },
  {
    id: "ORD-002", customerId: "c3", customerName: "Ana Oliveira",
    items: [
      { productId: "p14", productName: "Arroz Branco (5kg)", quantity: 1, unitPrice: 24.90, totalPrice: 24.90, unitType: "un" },
      { productId: "p15", productName: "Feijao Preto (1kg)", quantity: 2, unitPrice: 8.90, totalPrice: 17.80, unitType: "un" },
      { productId: "p8", productName: "Peito de Frango (kg)", quantity: 2, unitPrice: 18.90, totalPrice: 37.80, unitType: "kg" },
      { productId: "p19", productName: "Oleo de Soja (900ml)", quantity: 1, unitPrice: 7.99, totalPrice: 7.99, unitType: "un" },
    ],
    subtotal: 88.49, deliveryFee: 5.00, total: 93.49, paymentMethod: "Cartao", status: "saiu_entrega", source: "marketplace",
    notes: "Entregar ate 11h", address: "Rua Sao Paulo, 789", neighborhood: "Centro", createdAt: "2026-03-13T09:15:00",
  },
  {
    id: "ORD-003", customerId: "c4", customerName: "Carlos Pereira",
    items: [
      { productId: "p2", productName: "Maca Fuji (kg)", quantity: 3, unitPrice: 9.90, totalPrice: 29.70, unitType: "kg" },
      { productId: "p4", productName: "Tomate Italiano (kg)", quantity: 2, unitPrice: 7.99, totalPrice: 15.98, unitType: "kg" },
      { productId: "p11", productName: "Ovos (duzia)", quantity: 2, unitPrice: 12.90, totalPrice: 25.80, unitType: "un" },
      { productId: "p21", productName: "Cafe em Po (500g)", quantity: 1, unitPrice: 16.90, totalPrice: 16.90, unitType: "un" },
    ],
    subtotal: 88.38, deliveryFee: 3.50, total: 91.88, paymentMethod: "Cartao", status: "em_separacao", source: "admin",
    notes: "", address: "Rua Minas Gerais, 321", neighborhood: "Boa Vista", createdAt: "2026-03-13T10:00:00",
  },
  {
    id: "ORD-004", customerId: "c6", customerName: "Roberto Souza",
    items: [
      { productId: "p9", productName: "Carne Moida (kg)", quantity: 1, unitPrice: 29.90, totalPrice: 29.90, unitType: "kg" },
      { productId: "p16", productName: "Macarrao Espaguete (500g)", quantity: 2, unitPrice: 4.99, totalPrice: 9.98, unitType: "un" },
      { productId: "p22", productName: "Molho de Tomate (340g)", quantity: 2, unitPrice: 3.99, totalPrice: 7.98, unitType: "un" },
    ],
    subtotal: 47.86, deliveryFee: 4.50, total: 52.36, paymentMethod: "PIX", status: "pendente", source: "marketplace",
    notes: "", address: "Av. Paulista, 1000", neighborhood: "Jardim America", createdAt: "2026-03-13T10:30:00",
  },
  {
    id: "ORD-005", customerId: "c9", customerName: "Juliana Martins",
    items: [
      { productId: "p1", productName: "Banana Prata (kg)", quantity: 3, unitPrice: 5.99, totalPrice: 17.97, unitType: "kg" },
      { productId: "p3", productName: "Laranja Pera (kg)", quantity: 5, unitPrice: 4.49, totalPrice: 22.45, unitType: "kg" },
      { productId: "p5", productName: "Alface Crespa (un)", quantity: 2, unitPrice: 3.49, totalPrice: 6.98, unitType: "un" },
      { productId: "p18", productName: "Agua Mineral (1.5L)", quantity: 6, unitPrice: 2.99, totalPrice: 17.94, unitType: "un" },
    ],
    subtotal: 65.34, deliveryFee: 3.00, total: 68.34, paymentMethod: "Dinheiro", status: "pronto_entrega", source: "marketplace",
    notes: "Troco para R$100", address: "Rua Goias, 890", neighborhood: "Vila Nova", createdAt: "2026-03-13T11:00:00",
  },
  {
    id: "ORD-006", customerId: "c2", customerName: "Joao Santos",
    items: [
      { productId: "p17", productName: "Refrigerante Cola (2L)", quantity: 2, unitPrice: 8.99, totalPrice: 17.98, unitType: "un" },
      { productId: "p20", productName: "Acucar Cristal (1kg)", quantity: 2, unitPrice: 5.49, totalPrice: 10.98, unitType: "un" },
      { productId: "p23", productName: "Detergente Neutro (500ml)", quantity: 3, unitPrice: 2.49, totalPrice: 7.47, unitType: "un" },
    ],
    subtotal: 36.43, deliveryFee: 4.50, total: 40.93, paymentMethod: "Cartao", status: "entregue", source: "admin",
    notes: "", address: "Av. Brasil, 456", neighborhood: "Jardim America", createdAt: "2026-03-13T08:45:00", deliveredAt: "2026-03-13T09:50:00",
  },
  {
    id: "ORD-007", customerId: "c8", customerName: "Pedro Alves",
    items: [
      { productId: "p8", productName: "Peito de Frango (kg)", quantity: 2, unitPrice: 18.90, totalPrice: 37.80, unitType: "kg" },
      { productId: "p14", productName: "Arroz Branco (5kg)", quantity: 1, unitPrice: 24.90, totalPrice: 24.90, unitType: "un" },
      { productId: "p12", productName: "Iogurte Natural (170g)", quantity: 4, unitPrice: 3.99, totalPrice: 15.96, unitType: "un" },
    ],
    subtotal: 78.66, deliveryFee: 3.50, total: 82.16, paymentMethod: "PIX", status: "pendente", source: "marketplace",
    notes: "", address: "Rua Parana, 567", neighborhood: "Boa Vista", createdAt: "2026-03-13T11:30:00",
  },
  {
    id: "ORD-008", customerId: "c5", customerName: "Fernanda Lima",
    items: [
      { productId: "p7", productName: "Batata Lavada (kg)", quantity: 3, unitPrice: 6.99, totalPrice: 20.97, unitType: "kg" },
      { productId: "p6", productName: "Cebola (kg)", quantity: 2, unitPrice: 5.49, totalPrice: 10.98, unitType: "kg" },
    ],
    subtotal: 31.95, deliveryFee: 3.00, total: 34.95, paymentMethod: "Dinheiro", status: "cancelado", source: "admin",
    notes: "Cliente cancelou - nao estava em casa", address: "Rua Rio de Janeiro, 654", neighborhood: "Vila Nova", createdAt: "2026-03-13T09:00:00",
  },
];

export const deliveries: Delivery[] = [
  { id: "d1", orderId: "ORD-001", customerName: "Maria da Silva", address: "Rua das Flores, 123", neighborhood: "Vila Nova", deliveryPerson: "Lucas Ferreira", status: "entregue", assignedAt: "2026-03-13T08:45:00", deliveredAt: "2026-03-13T09:45:00", notes: "" },
  { id: "d2", orderId: "ORD-002", customerName: "Ana Oliveira", address: "Rua Sao Paulo, 789", neighborhood: "Centro", deliveryPerson: "Lucas Ferreira", status: "saiu_entrega", assignedAt: "2026-03-13T09:30:00", notes: "" },
  { id: "d3", orderId: "ORD-006", customerName: "Joao Santos", address: "Av. Brasil, 456", neighborhood: "Jardim America", deliveryPerson: "Rafael Mendes", status: "entregue", assignedAt: "2026-03-13T09:00:00", deliveredAt: "2026-03-13T09:50:00", notes: "" },
  { id: "d4", orderId: "ORD-005", customerName: "Juliana Martins", address: "Rua Goias, 890", neighborhood: "Vila Nova", deliveryPerson: "Rafael Mendes", status: "atribuida", assignedAt: "2026-03-13T11:15:00", notes: "Aguardando sacolas serem fechadas" },
];

export const stockMovements: StockMovement[] = [
  { id: "sm1", productId: "p1", productName: "Banana Prata (kg)", type: "entrada", quantity: 100, reason: "Fornecedor - CEASA", date: "2026-03-13T06:00:00" },
  { id: "sm2", productId: "p1", productName: "Banana Prata (kg)", type: "saida", quantity: 8, reason: "Pedidos ORD-001 / ORD-005", date: "2026-03-13T08:30:00" },
  { id: "sm3", productId: "p14", productName: "Arroz Branco (5kg)", type: "saida", quantity: 2, reason: "Pedidos ORD-002 / ORD-007", date: "2026-03-13T09:15:00" },
  { id: "sm4", productId: "p22", productName: "Molho de Tomate (340g)", type: "saida", quantity: 7, reason: "Vendas do dia", date: "2026-03-13T10:30:00" },
  { id: "sm5", productId: "p8", productName: "Peito de Frango (kg)", type: "entrada", quantity: 40, reason: "Fornecedor - Frigorifico", date: "2026-03-13T07:00:00" },
  { id: "sm6", productId: "p8", productName: "Peito de Frango (kg)", type: "saida", quantity: 6, reason: "Pedidos do dia", date: "2026-03-13T11:00:00" },
  { id: "sm7", productId: "p10", productName: "Leite Integral (1L)", type: "ajuste", quantity: -3, reason: "Vencimento proximo - retirado", date: "2026-03-12T14:00:00" },
  { id: "sm8", productId: "p2", productName: "Maca Fuji (kg)", type: "entrada", quantity: 60, reason: "Fornecedor - CEASA", date: "2026-03-13T06:00:00" },
];

export const weekSalesData = [
  { day: "Seg", vendas: 1280 },
  { day: "Ter", vendas: 1150 },
  { day: "Qua", vendas: 1340 },
  { day: "Qui", vendas: 1190 },
  { day: "Sex", vendas: 1680 },
  { day: "Sab", vendas: 2100 },
  { day: "Dom", vendas: 890 },
];

export const topProductsData = [
  { name: "Arroz 5kg", vendas: 85 },
  { name: "Feijao Preto", vendas: 72 },
  { name: "Banana Prata", vendas: 68 },
  { name: "Leite Integral", vendas: 61 },
  { name: "Peito Frango", vendas: 48 },
];

export const neighborhoodData = [
  { name: "Vila Nova", pedidos: 62 },
  { name: "Jardim America", pedidos: 45 },
  { name: "Centro", pedidos: 38 },
  { name: "Boa Vista", pedidos: 31 },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

export const statusLabels: Record<OrderStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_separacao: "Em Separacao",
  pronto_entrega: "Pronto p/ Entrega",
  saiu_entrega: "Saiu p/ Entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const statusColors: Record<OrderStatus, string> = {
  pendente: "bg-amber-100 text-amber-700",
  confirmado: "bg-cyan-100 text-cyan-700",
  em_separacao: "bg-blue-100 text-blue-700",
  pronto_entrega: "bg-purple-100 text-purple-700",
  saiu_entrega: "bg-orange-100 text-orange-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  atribuida: "Atribuida",
  saiu_entrega: "Em Rota",
  entregue: "Entregue",
  cancelada: "Cancelada",
};

export const deliveryStatusColors: Record<DeliveryStatus, string> = {
  atribuida: "bg-blue-100 text-blue-700",
  saiu_entrega: "bg-orange-100 text-orange-700",
  entregue: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
};
