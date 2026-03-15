// Domain types for UI (no mock data)

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
