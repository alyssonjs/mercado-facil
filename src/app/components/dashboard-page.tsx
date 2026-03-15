import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Truck,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatCurrency, formatTime } from "../lib/format";
import { statusLabels, statusColors } from "../lib/status-maps";
import type { Order } from "../lib/types";
import { hasApi, dashboard as apiDashboard, orders as apiOrders, inventory as apiInventory, type ApiOrder } from "../lib/api";

function mapApiOrderToOrder(o: ApiOrder): Order {
  return {
    id: String(o.id),
    customerId: String(o.customer_id),
    customerName: o.customer_name,
    items: (o.items ?? []).map((i) => ({
      productId: "",
      productName: i.product_name_snapshot,
      quantity: i.quantity,
      unitPrice: i.total_price_cents / 100 / i.quantity,
      totalPrice: i.total_price_cents / 100,
      unitType: i.unit_type ?? "un",
    })),
    subtotal: o.subtotal_cents / 100,
    deliveryFee: o.delivery_fee_cents / 100,
    total: o.total_cents / 100,
    paymentMethod: o.payment_method ?? "",
    status: (o.status as Order["status"]) ?? "pendente",
    source: o.source === "marketplace" ? "marketplace" : "admin",
    notes: o.notes ?? "",
    address: "",
    neighborhood: o.neighborhood_snapshot ?? "",
    createdAt: o.ordered_at ?? o.created_at ?? new Date().toISOString(),
  };
}

export function DashboardPage() {
  const [apiMetrics, setApiMetrics] = useState<{
    orders_today: number;
    revenue_today_cents: number;
    ticket_medium_cents: number;
    pending_orders: number;
    deliveries_in_progress: number;
    low_stock_products: number;
  } | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<{ id: number; name: string; slug: string; stock_quantity: number; minimum_stock_alert: number; low_stock: boolean }[]>([]);

  useEffect(() => {
    if (!hasApi()) return;
    apiDashboard.get().then(setApiMetrics).catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasApi()) return;
    Promise.all([
      apiOrders.list("pendente").catch(() => []),
      apiOrders.list("em_separacao").catch(() => []),
    ]).then(([pend, sep]) => {
      setPendingOrders([...pend.map(mapApiOrderToOrder), ...sep.map(mapApiOrderToOrder)]);
    });
  }, []);

  useEffect(() => {
    if (!hasApi()) return;
    apiInventory.list().then((list) => {
      setLowStockProducts(list.filter((p) => p.low_stock));
    }).catch(() => {});
  }, []);

  const totalOrdersToday = apiMetrics?.orders_today ?? 0;
  const revenueToday = apiMetrics ? apiMetrics.revenue_today_cents / 100 : 0;
  const activeDeliveries = apiMetrics?.deliveries_in_progress ?? 0;
  const avgTicket = apiMetrics ? apiMetrics.ticket_medium_cents / 100 : 0;
  const lowStockCount = apiMetrics?.low_stock_products ?? lowStockProducts.length;

  const metrics = [
    {
      label: "Pedidos Hoje",
      value: totalOrdersToday.toString(),
      icon: ShoppingCart,
      change: "",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Faturamento Hoje",
      value: formatCurrency(revenueToday),
      icon: DollarSign,
      change: "",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Entregas Ativas",
      value: activeDeliveries.toString(),
      icon: Truck,
      change: "",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Ticket Medio",
      value: formatCurrency(avgTicket),
      icon: TrendingUp,
      change: "",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Visao geral do dia
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="gap-4 py-5">
            <CardContent className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-muted-foreground">{m.label}</p>
                <p className="text-[20px]">{m.value}</p>
              </div>
              {m.change && (
                <span className="text-[11px] text-emerald-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {m.change}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pedidos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Nenhum pedido pendente</p>
            ) : (
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px]">{order.id}</span>
                        <Badge className={`text-[10px] ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {order.customerName} - {order.neighborhood}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px]">{formatCurrency(order.total)}</p>
                      <p className="text-[11px] text-muted-foreground">{formatTime(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockCount === 0 ? (
              <p className="text-[13px] text-muted-foreground">Estoque OK</p>
            ) : lowStockProducts.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">{lowStockCount} produto(s) com estoque baixo</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${p.stock_quantity === 0 ? "bg-destructive" : "bg-amber-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] truncate">{p.name}</p>
                    </div>
                    <span className={`text-[12px] ${p.stock_quantity <= 3 ? "text-destructive" : "text-amber-600"}`}>
                      {p.stock_quantity} un
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
