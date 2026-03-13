import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  orders,
  storeSettings,
  formatCurrency,
  formatDateTime,
  statusLabels,
  statusColors,
  type Order,
  type OrderStatus,
} from "../../data/mock-data";

const statusSteps: { status: OrderStatus; icon: typeof Clock; label: string }[] = [
  { status: "pendente", icon: Clock, label: "Pendente" },
  { status: "confirmado", icon: CheckCircle2, label: "Confirmado" },
  { status: "em_separacao", icon: Package, label: "Em Separacao" },
  { status: "pronto_entrega", icon: Package, label: "Pronto" },
  { status: "saiu_entrega", icon: Truck, label: "Em Rota" },
  { status: "entregue", icon: CheckCircle2, label: "Entregue" },
];

function getStepIndex(status: OrderStatus): number {
  if (status === "cancelado") return -1;
  return statusSteps.findIndex((s) => s.status === status);
}

export function TrackingPage() {
  const [phone, setPhone] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [result, setResult] = useState<Order | null | "not_found">(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!orderCode) return;
    const found = orders.find(
      (o) => o.id.toLowerCase() === orderCode.toLowerCase()
    );
    setResult(found || "not_found");
    setSearched(true);
  };

  const currentStep = result && result !== "not_found" ? getStepIndex(result.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to={`/loja/${storeSettings.slug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Mercado Boa Vista</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1>Rastrear Pedido</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Informe o codigo do seu pedido para acompanhar o status
          </p>
        </div>

        {/* Search form */}
        <Card className="mb-8">
          <CardContent className="py-6 space-y-4">
            <div>
              <Label>Codigo do Pedido</Label>
              <Input
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="Ex: ORD-001"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <Label>Telefone (opcional)</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <Button className="w-full gap-2" onClick={handleSearch}>
              <Search className="w-4 h-4" />
              Buscar Pedido
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {searched && result === "not_found" && (
          <Card>
            <CardContent className="py-8 text-center">
              <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-[14px] text-muted-foreground">
                Pedido nao encontrado. Verifique o codigo e tente novamente.
              </p>
            </CardContent>
          </Card>
        )}

        {result && result !== "not_found" && (
          <div className="space-y-4">
            {/* Order info */}
            <Card>
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[16px]">{result.id}</h3>
                    <p className="text-[12px] text-muted-foreground">
                      {formatDateTime(result.createdAt)}
                    </p>
                  </div>
                  <Badge className={`${statusColors[result.status]} text-[11px]`}>
                    {statusLabels[result.status]}
                  </Badge>
                </div>

                {/* Status timeline */}
                {result.status !== "cancelado" ? (
                  <div className="relative">
                    <div className="flex justify-between">
                      {statusSteps.map((step, i) => {
                        const isCompleted = i <= currentStep;
                        const isCurrent = i === currentStep;
                        return (
                          <div
                            key={step.status}
                            className="flex flex-col items-center flex-1 relative"
                          >
                            {i > 0 && (
                              <div
                                className={`absolute top-3.5 -left-1/2 right-1/2 h-0.5 ${
                                  isCompleted ? "bg-primary" : "bg-border"
                                }`}
                              />
                            )}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : isCompleted
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent text-muted-foreground"
                              }`}
                            >
                              <step.icon className="w-3.5 h-3.5" />
                            </div>
                            <span
                              className={`text-[9px] mt-1.5 text-center ${
                                isCompleted
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-[13px] text-red-600">
                    <XCircle className="w-4 h-4" />
                    Este pedido foi cancelado
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order details */}
            <Card>
              <CardContent className="py-5 space-y-3">
                <h4 className="text-[14px]">Itens do Pedido</h4>
                {result.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-[13px] py-1 border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground">
                      {item.quantity} {item.unitType} x {item.productName}
                    </span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
                <div className="pt-2 space-y-1 text-[13px]">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(result.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Entrega</span>
                    <span>{formatCurrency(result.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-[15px] pt-1 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(result.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery info */}
            <Card>
              <CardContent className="py-5 text-[13px] space-y-2">
                <h4 className="text-[14px]">Entrega</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endereco</span>
                  <span>{result.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bairro</span>
                  <span>{result.neighborhood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagamento</span>
                  <span>{result.paymentMethod}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}