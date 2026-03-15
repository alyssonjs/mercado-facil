import type { OrderStatus, DeliveryStatus } from "./types";

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
