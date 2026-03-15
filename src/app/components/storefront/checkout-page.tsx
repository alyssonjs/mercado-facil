import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Truck,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { useCart } from "./cart-context";
import { useStorefront } from "./storefront-context";
import { formatCurrency } from "../../lib/format";
import { hasApi, storefront } from "../../lib/api";

export function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: storefrontData } = useStorefront();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhoodName, setNeighborhoodName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [changeFor, setChangeFor] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [confirmTotal, setConfirmTotal] = useState(0);
  const [apiDeliveryFeeCents, setApiDeliveryFeeCents] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = hasApi() && slug && apiDeliveryFeeCents !== null
    ? apiDeliveryFeeCents / 100
    : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!hasApi() || !slug || !neighborhoodName.trim()) {
      setApiDeliveryFeeCents(null);
      return;
    }
    storefront.calculateDelivery(slug, neighborhoodName.trim()).then((r) => setApiDeliveryFeeCents(r.delivery_fee_cents)).catch(() => setApiDeliveryFeeCents(0));
  }, [slug, neighborhoodName]);

  const canSubmit =
    name && phone && address && neighborhoodName.trim() && paymentMethod && items.length > 0;

  const storeSlug = slug ?? storefrontData?.store?.slug ?? "";
  const deliveryTimeMinutes = (storefrontData?.settings?.delivery_time_minutes as number) ?? 40;
  const acceptsCash = (storefrontData?.settings?.accepts_cash as boolean) ?? true;
  const acceptsPix = (storefrontData?.settings?.accepts_pix as boolean) ?? true;
  const acceptsCardOnDelivery = (storefrontData?.settings?.accepts_card_on_delivery as boolean) ?? true;

  const handleSubmit = async () => {
    if (!canSubmit || !hasApi() || !slug) return;
    setSubmitting(true);
    try {
      const res = await storefront.checkout(slug, {
        name,
        phone,
        address: complement ? `${address}, ${complement}` : address,
        neighborhood: neighborhoodName.trim(),
        payment_method: paymentMethod,
        delivery_fee_cents: Math.round(deliveryFee * 100),
        change_for_cents: changeFor ? Math.round(parseFloat(changeFor) * 100) : undefined,
        notes: notes || undefined,
        items: items.map((i) => ({ product_id: Number(i.product.id), quantity: i.quantity })),
      });
      setOrderId(String(res.order_id));
      setConfirmTotal(res.total_cents / 100);
      setSubmitted(true);
      clearCart();
    } catch {
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-green-700 mb-2">Pedido Enviado!</h1>
        <p className="text-[14px] text-muted-foreground mb-1">
          Seu pedido <span className="text-foreground">{orderId}</span> foi recebido com sucesso.
        </p>
        <p className="text-[13px] text-muted-foreground mb-6">
          Tempo estimado de entrega: ~{deliveryTimeMinutes} minutos
        </p>

        <Card className="max-w-sm w-full mb-6">
          <CardContent className="py-4 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Codigo</span>
              <span>{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-primary">{formatCurrency(confirmTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pagamento</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-amber-600">Pendente</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/loja/${storeSlug}`)}
          >
            Voltar a Loja
          </Button>
          <Button onClick={() => navigate("/rastrear")}>
            Rastrear Pedido
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitted) {
    navigate(`/loja/${storeSlug}/carrinho`);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/loja/${storeSlug}/carrinho`)}
          className="p-2 rounded-lg hover:bg-accent"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1>Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal info */}
          <Card>
            <CardContent className="py-5 space-y-4">
              <h3 className="text-[15px] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Dados de Entrega
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label>Endereco</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, numero"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Bairro</Label>
                  <Input
                    value={neighborhoodName}
                    onChange={(e) => setNeighborhoodName(e.target.value)}
                    placeholder="Ex: Centro, Vila Nova"
                  />
                </div>
                <div>
                  <Label>Complemento</Label>
                  <Input
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto, bloco, referencia"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="py-5 space-y-4">
              <h3 className="text-[15px] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Forma de Pagamento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {acceptsCash && (
                  <button
                    onClick={() => setPaymentMethod("Dinheiro")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === "Dinheiro"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-green-600" />
                    <span className="text-[13px]">Dinheiro</span>
                  </button>
                )}
                {acceptsPix && (
                  <button
                    onClick={() => setPaymentMethod("PIX")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === "PIX"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-cyan-600" />
                    <span className="text-[13px]">PIX</span>
                  </button>
                )}
                {acceptsCardOnDelivery && (
                  <button
                    onClick={() => setPaymentMethod("Cartao")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === "Cartao"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="text-[13px]">Cartao</span>
                  </button>
                )}
              </div>
              {paymentMethod === "Dinheiro" && (
                <div className="max-w-xs">
                  <Label>Troco para quanto? (R$)</Label>
                  <Input
                    type="number"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    placeholder="Ex: 100"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="py-5">
              <Label>Observacoes do pedido</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: sem cebola, entregar no portao lateral..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="py-5 space-y-4">
              <h3 className="text-[15px]">Resumo</h3>

              <div className="space-y-2 text-[13px] max-h-[200px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-muted-foreground truncate mr-2">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entrega</span>
                  <span>
                    {neighborhoodName.trim()
                      ? formatCurrency(deliveryFee)
                      : "Informe o bairro"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-[17px]">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Truck className="w-3.5 h-3.5" />
                Entrega em ~{deliveryTimeMinutes} min
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
              >
                {submitting ? "Enviando..." : "Confirmar Pedido"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}