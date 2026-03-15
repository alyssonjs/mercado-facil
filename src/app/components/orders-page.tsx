import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { formatCurrency } from "../lib/format";
import { statusLabels, statusColors } from "../lib/status-maps";
import type { Order, OrderStatus, OrderItem, Product, Customer } from "../lib/types";
import { hasApi, orders as apiOrders, products as apiProducts, customers as apiCustomers, type ApiOrder } from "../lib/api";

const statusFlow: OrderStatus[] = [
  "pendente",
  "confirmado",
  "em_separacao",
  "pronto_entrega",
  "saiu_entrega",
  "entregue",
];

function mapApiOrderToOrder(o: ApiOrder): Order {
  const items = (o.items ?? []).map((i) => ({
    productId: "",
    productName: i.product_name_snapshot,
    quantity: i.quantity,
    unitPrice: i.total_price_cents / 100 / i.quantity,
    totalPrice: i.total_price_cents / 100,
    unitType: i.unit_type ?? "un",
  }));
  return {
    id: String(o.id),
    customerId: String(o.customer_id),
    customerName: o.customer_name,
    items,
    subtotal: o.subtotal_cents / 100,
    deliveryFee: o.delivery_fee_cents / 100,
    total: o.total_cents / 100,
    paymentMethod: o.payment_method ?? "",
    status: (o.status as OrderStatus) ?? "pendente",
    source: (o.source === "marketplace" ? "marketplace" : "admin") as "admin" | "marketplace",
    notes: o.notes ?? "",
    address: "",
    neighborhood: o.neighborhood_snapshot ?? "",
    createdAt: o.created_at ?? new Date().toISOString(),
  };
}

export function OrdersPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, Order>>({});
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("Dinheiro");
  const [orderNotes, setOrderNotes] = useState("");

  const loadOrders = () => {
    if (!hasApi()) return;
    apiOrders.list(statusFilter === "all" ? undefined : statusFilter).then((list) => {
      setOrdersList(list.map((o) => ({ ...mapApiOrderToOrder(o), items: [] })));
    }).catch(() => {});
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (!hasApi()) return;
    Promise.all([apiProducts.list(), apiCustomers.list()]).then(([prods, custs]) => {
      setProductsList(prods.map((p) => ({
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        category: p.category_name ?? "",
        price: p.price_cents / 100,
        saleType: (p.sale_type === "weight" ? "weight" : "unit") as "unit" | "weight",
        unitType: p.unit_type ?? "un",
        stock: p.stock_quantity,
        minStock: p.minimum_stock_alert ?? 0,
        active: p.active,
        featured: p.featured,
        description: p.description ?? "",
      })));
      setCustomersList(custs.map((c) => ({
        id: String(c.id),
        name: c.name,
        phone: c.phone,
        email: c.email ?? undefined,
        address: c.address_line,
        neighborhood: c.neighborhood,
        complement: undefined,
        notes: c.notes ?? "",
        totalOrders: c.total_orders ?? 0,
        lastOrder: "-",
      })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasApi() || !expandedOrder) return;
    if (orderDetails[expandedOrder]) return;
    apiOrders.get(Number(expandedOrder)).then((o) => {
      setOrderDetails((prev) => ({ ...prev, [expandedOrder]: mapApiOrderToOrder(o) }));
    }).catch(() => {});
  }, [expandedOrder]);

  const filtered = ordersList.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const displayOrder = (order: Order) => orderDetails[order.id] ?? order;

  const advanceStatus = async (orderId: string) => {
    const order = ordersList.find((o) => o.id === orderId);
    if (!order) return;
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx < 0 || currentIdx >= statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIdx + 1];
    if (hasApi()) {
      try {
        await apiOrders.changeStatus(Number(orderId), nextStatus);
        loadOrders();
      } catch {}
      return;
    }
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  const cancelOrder = async (orderId: string) => {
    if (hasApi()) {
      try {
        await apiOrders.cancel(Number(orderId));
        loadOrders();
      } catch {}
      return;
    }
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelado" as OrderStatus } : o))
    );
  };

  const addToCart = () => {
    const product = productsList.find((p) => p.id === selectedProduct);
    if (!product) return;
    const qty = parseFloat(quantity) || 1;
    const item: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: product.price,
      totalPrice: product.price * qty,
      unitType: product.unitType,
    };
    setCartItems((prev) => [...prev, item]);
    setSelectedProduct("");
    setQuantity("1");
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 5.0;

  const createOrder = async () => {
    if (!selectedCustomer || cartItems.length === 0) return;
    const customer = customersList.find((c) => c.id === selectedCustomer);
    if (!customer) return;

    if (hasApi()) {
      setCreating(true);
      try {
        await apiOrders.create({
          customer_id: Number(selectedCustomer),
          source: "admin",
          payment_method: paymentMethod,
          delivery_fee_cents: Math.round(deliveryFee * 100),
          notes: orderNotes || null,
          neighborhood_snapshot: customer.neighborhood,
          items: cartItems.map((i) => ({ product_id: Number(i.productId), quantity: i.quantity })),
        });
        loadOrders();
        setNewOrderOpen(false);
        setSelectedCustomer("");
        setCartItems([]);
        setOrderNotes("");
      } catch {
        setCreating(false);
      } finally {
        setCreating(false);
      }
      return;
    }

    const newOrder: Order = {
      id: `ORD-${String(ordersList.length + 1).padStart(3, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      items: cartItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartSubtotal + deliveryFee,
      paymentMethod,
      status: "pendente",
      source: "admin",
      notes: orderNotes,
      address: customer.address,
      neighborhood: customer.neighborhood,
      createdAt: new Date().toISOString(),
    };
    setOrdersList((prev) => [newOrder, ...prev]);
    setNewOrderOpen(false);
    setSelectedCustomer("");
    setCartItems([]);
    setOrderNotes("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Pedidos</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            {ordersList.length} pedidos registrados
          </p>
        </div>
        <Button onClick={() => setNewOrderOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...Object.keys(statusLabels)] as (OrderStatus | "all")[]).map((s) => {
          const count =
            s === "all" ? ordersList.length : ordersList.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {s === "all" ? "Todos" : statusLabels[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID ou cliente..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <Card key={order.id}>
            <CardContent className="py-4">
              {/* Order header */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px]">{order.id}</span>
                    <Badge className={`text-[10px] ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </Badge>
                    <Badge className={`text-[10px] ${order.source === "marketplace" ? "bg-cyan-100 text-cyan-800" : "bg-gray-100 text-gray-700"}`}>
                      {order.source === "marketplace" ? "Loja Online" : "Manual"}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {order.customerName} - {order.neighborhood}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[14px]">{formatCurrency(order.total)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                {expandedOrder === order.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Items */}
                  <div>
                    <p className="text-[12px] text-muted-foreground mb-2">Itens do pedido:</p>
                    <div className="space-y-1.5">
                      {(displayOrder(order).items ?? []).map((item, i) => (
                        <div key={i} className="flex justify-between text-[13px]">
                          <span>
                            {item.quantity} {item.unitType} x {item.productName}
                          </span>
                          <span>{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-border space-y-1">
                      <div className="flex justify-between text-[12px] text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(displayOrder(order).subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[12px] text-muted-foreground">
                        <span>Taxa de entrega</span>
                        <span>{formatCurrency(displayOrder(order).deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span>Total</span>
                        <span>{formatCurrency(displayOrder(order).total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                    <div>
                      <span className="text-muted-foreground">Pagamento:</span>
                      <span className="ml-1">{displayOrder(order).paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Endereco:</span>
                      <span className="ml-1">{displayOrder(order).address || "—"}</span>
                    </div>
                    {displayOrder(order).notes && (
                      <div>
                        <span className="text-muted-foreground">Obs:</span>
                        <span className="ml-1">{displayOrder(order).notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {order.status !== "entregue" && order.status !== "cancelado" && (
                      <>
                        <Button size="sm" onClick={() => advanceStatus(order.id)}>
                          Avancar Status
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Order Dialog */}
      <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Cliente</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                <SelectContent>
                  {customersList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} - {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add product */}
            <div className="p-3 rounded-lg bg-accent/50 space-y-3">
              <p className="text-[13px]">Adicionar produto:</p>
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Produto" /></SelectTrigger>
                  <SelectContent>
                    {productsList.filter((p) => p.active).map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - {formatCurrency(p.price)}/{p.unitType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="w-20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Qtd"
                />
                <Button size="sm" onClick={addToCart} disabled={!selectedProduct}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Cart */}
            {cartItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-[13px]">Itens ({cartItems.length}):</p>
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[13px] py-1.5 border-b border-border">
                    <span>
                      {item.quantity} {item.unitType} x {item.productName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{formatCurrency(item.totalPrice)}</span>
                      <button
                        onClick={() => removeFromCart(i)}
                        className="text-destructive text-[11px] hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-[13px] pt-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted-foreground">Entrega</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-[15px] pt-1 border-t border-border">
                  <span>Total</span>
                  <span>{formatCurrency(cartSubtotal + deliveryFee)}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cartao">Cartao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Observacoes</Label>
                <Input value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Opcional" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOrderOpen(false)}>Cancelar</Button>
            <Button onClick={createOrder} disabled={!selectedCustomer || cartItems.length === 0 || creating}>
              {creating ? "Criando..." : "Criar Pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}