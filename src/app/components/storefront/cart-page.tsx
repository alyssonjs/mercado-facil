import { Link, useNavigate, useParams } from "react-router";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useCart } from "./cart-context";
import { useStorefront } from "./storefront-context";
import { formatCurrency } from "../../lib/format";

export function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: storefrontData } = useStorefront();
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const minimumOrderCents = (storefrontData?.settings?.minimum_order_cents as number) ?? 3000;
  const minimumOrder = minimumOrderCents / 100;
  const storeSlug = slug ?? storefrontData?.store?.slug ?? "";
  const meetsMinimum = subtotal >= minimumOrder;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h2 className="mb-2">Seu carrinho esta vazio</h2>
        <p className="text-[14px] text-muted-foreground mb-6">
          Adicione produtos para comecar seu pedido
        </p>
        <Button onClick={() => navigate(`/loja/${storeSlug}`)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Ver Produtos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/loja/${storeSlug}`)}
          className="p-2 rounded-lg hover:bg-accent"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1>Carrinho</h1>
          <p className="text-[14px] text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      {item.product.imageUrl ? (
                        <ImageWithFallback
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-xl">
                          🍣
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] truncate">{item.product.name}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {formatCurrency(item.product.price)}/{item.product.unitType}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground shrink-0 touch-manipulation"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - (item.product.saleType === "weight" ? 0.5 : 1)
                          )
                        }
                        className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-accent flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-[14px] font-medium w-10 sm:w-8 text-center tabular-nums">
                        {item.product.saleType === "weight"
                          ? item.quantity.toFixed(1)
                          : item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + (item.product.saleType === "weight" ? 0.5 : 1)
                          )
                        }
                        className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-primary text-primary-foreground flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <p className="text-[14px] font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <button
            onClick={clearCart}
            className="text-[13px] text-destructive hover:underline"
          >
            Limpar carrinho
          </button>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="py-5 space-y-4">
              <h3 className="text-[15px]">Resumo do Pedido</h3>

              <div className="space-y-2 text-[13px]">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-muted-foreground truncate mr-2">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[12px] text-muted-foreground">
                  <span>Entrega</span>
                  <span>Calculada no checkout</span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-[16px]">
                  <span>Subtotal</span>
                  <span className="text-primary">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {!meetsMinimum && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-800">
                  Pedido minimo de {formatCurrency(minimumOrder)}. Faltam{" "}
                  {formatCurrency(minimumOrder - subtotal)}.
                </div>
              )}

              <Button
                className="w-full gap-2"
                disabled={!meetsMinimum}
                onClick={() => navigate(`/loja/${storeSlug}/checkout`)}
              >
                Ir para Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/loja/${storeSlug}`)}
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}