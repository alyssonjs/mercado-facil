import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useParams } from "react-router";
import { ShoppingCart, Clock, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart, CartProvider } from "./cart-context";
import { storeSettings } from "../../data/mock-data";
import { hasApi, storefront } from "../../lib/api";

type StoreData = {
  store: { name: string; slug: string; phone: string; address: string };
  settings: { opening_hours?: string; closing_hours?: string };
} | null;

function StoreHeader() {
  const { slug } = useParams<{ slug: string }>();
  const { itemCount, subtotal } = useCart();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreData>(null);

  useEffect(() => {
    if (hasApi() && slug) {
      storefront.get(slug).then(setStoreData).catch(() => setStoreData(null));
    }
  }, [slug]);

  const name = storeData?.store?.name ?? storeSettings.name;
  const storeSlug = storeData?.store?.slug ?? storeSettings.slug;
  const phone = storeData?.store?.phone ?? storeSettings.phone;
  const address = storeData?.store?.address ?? storeSettings.address;
  const openingHours = (storeData?.settings?.opening_hours as string) ?? storeSettings.openingHours;
  const closingHours = (storeData?.settings?.closing_hours as string) ?? storeSettings.closingHours;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/loja/${storeSlug}`} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[15px] hidden sm:inline text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {name}
            </span>
          </Link>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-4 text-[12px] text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {openingHours} - {closingHours}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {phone}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 relative rounded-xl"
            onClick={() => navigate(`/loja/${storeSlug}/carrinho`)}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 min-h-[calc(100vh-180px)]">
        <Outlet />
      </main>

      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-3 sm:hidden z-50 shadow-lg">
          <button
            onClick={() => navigate(`/loja/${storeSlug}/carrinho`)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center gap-2 text-[14px]">
              <ShoppingCart className="w-4 h-4" />
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </span>
            <span className="text-[14px]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
            </span>
          </button>
        </div>
      )}

      <footer className="bg-white border-t border-gray-100 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-[13px] text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {name}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 mb-1">
            <MapPin className="w-3 h-3" />
            {address}
          </div>
          <p className="text-[11px] text-gray-400">
            Powered by <span className="text-primary">Mercado Facil</span>
          </p>
        </div>
      </footer>
    </>
  );
}

export function StoreLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <StoreHeader />
      </div>
    </CartProvider>
  );
}
