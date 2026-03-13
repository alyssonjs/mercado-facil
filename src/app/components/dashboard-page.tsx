import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Truck,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  orders,
  products,
  deliveries,
  formatCurrency,
  formatTime,
  statusLabels,
  statusColors,
  weekSalesData,
  topProductsData,
  neighborhoodData,
} from "../data/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { hasApi, dashboard as apiDashboard } from "../lib/api";

const COLORS = ["#16a34a", "#f97316", "#0ea5e9", "#8b5cf6", "#ef4444"];

export function DashboardPage() {
  const [apiMetrics, setApiMetrics] = useState<{
    orders_today: number;
    revenue_today_cents: number;
    ticket_medium_cents: number;
    pending_orders: number;
    deliveries_in_progress: number;
    low_stock_products: number;
  } | null>(null);

  useEffect(() => {
    if (hasApi()) apiDashboard.get().then(setApiMetrics).catch(() => {});
  }, []);

  const todayOrders = orders.filter((o) => o.status !== "cancelado");
  const todayRevenue = todayOrders
    .filter((o) => o.status === "entregue")
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersToday = apiMetrics ? apiMetrics.orders_today : orders.length;
  const activeDeliveries = apiMetrics ? apiMetrics.deliveries_in_progress : deliveries.filter(
    (d) => d.status === "saiu_entrega" || d.status === "atribuida"
  ).length;
  const avgTicket = apiMetrics
    ? apiMetrics.ticket_medium_cents / 100
    : todayRevenue / (todayOrders.filter((o) => o.status === "entregue").length || 1);
  const pendingOrders = orders.filter(
    (o) => o.status === "pendente" || o.status === "em_separacao"
  );
  const revenueToday = apiMetrics ? apiMetrics.revenue_today_cents / 100 : todayRevenue;
  const lowStockCount = apiMetrics ? apiMetrics.low_stock_products : products.filter((p) => p.stock <= p.minStock).length;
  const lowStockProducts = apiMetrics ? [] : products.filter((p) => p.stock <= p.minStock);

  const metrics = [
    {
      label: "Pedidos Hoje",
      value: totalOrdersToday.toString(),
      icon: ShoppingCart,
      change: "+12%",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Faturamento Hoje",
      value: formatCurrency(revenueToday),
      icon: DollarSign,
      change: "+8%",
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
      change: "+5%",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Visao geral do Mercado Boa Vista hoje, 13 de marco de 2026
        </p>
      </div>

      {/* Metric cards */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px]">Vendas nos Ultimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Vendas"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#1a1e2c" }}
                  />
                  <Bar dataKey="vendas" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[15px]">Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProductsData}
                    dataKey="vendas"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                  >
                    {topProductsData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {topProductsData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2 text-[12px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className="truncate flex-1 text-muted-foreground">{p.name}</span>
                  <span>{p.vendas} un</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
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

        {/* Alerts */}
        <Card>
          <CardHeader>
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
                    <div className={`w-2 h-2 rounded-full shrink-0 ${p.stock === 0 ? "bg-destructive" : "bg-amber-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.category}</p>
                    </div>
                    <span className={`text-[12px] ${p.stock <= 3 ? "text-destructive" : "text-amber-600"}`}>
                      {p.stock} {p.unitType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Neighborhood stats */}
          <CardHeader className="pt-0">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Pedidos por Bairro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {neighborhoodData.map((n) => (
                <div key={n.name} className="flex items-center gap-2">
                  <span className="text-[12px] text-muted-foreground w-28 truncate">
                    {n.name}
                  </span>
                  <div className="flex-1 bg-accent rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{
                        width: `${(n.pedidos / Math.max(...neighborhoodData.map((nn) => nn.pedidos))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-[12px] w-6 text-right">{n.pedidos}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}