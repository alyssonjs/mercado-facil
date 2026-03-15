import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Search,
  Plus,
  Minus,
  Star,
  Clock,
  Truck,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useCart } from "./cart-context";
import { formatCurrency } from "../../lib/format";
import type { Product } from "../../lib/types";
import { hasApi, storefront } from "../../lib/api";
import { useStorefront } from "./storefront-context";

function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group border-gray-100">
      <div className="h-36 sm:h-40 bg-gray-50 relative overflow-hidden">
        {product.imageUrl ? (
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <UtensilsCrossed className="w-8 h-8 text-primary/30" />
          </div>
        )}
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] gap-0.5 shadow-md">
            <Star className="w-2.5 h-2.5" fill="currentColor" />
            Destaque
          </Badge>
        )}
        {product.stock <= product.minStock && product.stock > 0 && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] shadow-md">
            Ultimas unidades
          </Badge>
        )}
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <CardContent className="py-3 px-3">
        <p className="text-[10px] text-primary uppercase tracking-wide">{product.category}</p>
        <p className="text-[13px] mt-0.5 line-clamp-1">{product.name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-end justify-between mt-2.5">
          <div>
            <span className="text-[17px] text-primary">
              {formatCurrency(product.price)}
            </span>
          </div>

          {!inCart ? (
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full shadow-md"
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
            >
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  inCart.quantity <= 1
                    ? removeItem(product.id)
                    : updateQuantity(product.id, inCart.quantity - 1)
                }
                className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[13px] w-6 text-center">{inCart.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function mapApiProductToProduct(p: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  sale_type: string;
  unit_type: string;
  stock_quantity: number;
  featured: boolean;
  image_url: string | null;
  category_name: string | null;
}): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.category_name ?? "",
    price: p.price_cents / 100,
    saleType: (p.sale_type === "weight" ? "weight" : "unit") as "unit" | "weight",
    unitType: p.unit_type ?? "un",
    stock: p.stock_quantity,
    minStock: 0,
    active: true,
    featured: p.featured,
    description: p.description ?? "",
    imageUrl: p.image_url ?? undefined,
  };
}

export function StoreHome() {
  const { slug } = useParams<{ slug: string }>();
  const { data: storefrontData } = useStorefront();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!hasApi() || !slug) return;
    Promise.all([
      storefront.categories(slug),
      storefront.products(slug),
    ]).then(([cats, prods]) => {
      setApiCategories(cats.map((c) => c.name));
      setApiProducts(prods.map(mapApiProductToProduct));
    }).catch(() => {});
  }, [slug]);

  const products = apiProducts;
  const categories = apiCategories;
  const displaySettings = storefrontData
    ? {
        name: storefrontData.store.name,
        address: storefrontData.store.address,
        openingHours: (storefrontData.settings.opening_hours as string) ?? "",
        closingHours: (storefrontData.settings.closing_hours as string) ?? "",
        deliveryTimeMinutes: (storefrontData.settings.delivery_time_minutes as number) ?? 40,
        minimumOrderCents: (storefrontData.settings.minimum_order_cents as number) ?? 3000,
        bannerUrl: (storefrontData.settings.banner_url as string) ?? "",
      }
    : { name: "Loja", address: "", openingHours: "", closingHours: "", deliveryTimeMinutes: 40, minimumOrderCents: 3000, bannerUrl: "" };

  const activeProducts = products.filter((p) => p.active && p.stock > 0);
  const featuredProducts = activeProducts.filter((p) => p.featured);

  const filteredProducts = activeProducts.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categoryIcons: Record<string, string> = {
    Frutas: "🍎",
    "Verduras e Legumes": "🥬",
    Carnes: "🥩",
    Laticinios: "🥛",
    Padaria: "🍞",
    "Graos e Cereais": "🌾",
    Bebidas: "🥤",
    Mercearia: "🛒",
    Limpeza: "🧹",
  };

  return (
    <div className="space-y-6">
      {/* Hero banner with image */}
      <div className="rounded-2xl overflow-hidden relative">
        <div className="h-48 sm:h-56">
          <ImageWithFallback
            src={displaySettings.bannerUrl}
            alt={displaySettings.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <h1 className="text-white">{displaySettings.name}</h1>
              <p className="text-white/80 text-[13px]">{displaySettings.address}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[12px] border border-white/10">
              <Clock className="w-3.5 h-3.5" />
              {displaySettings.openingHours} - {displaySettings.closingHours}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[12px] border border-white/10">
              <Truck className="w-3.5 h-3.5" />
              ~{displaySettings.deliveryTimeMinutes} min
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[12px] border border-white/10">
              <ShoppingCart className="w-3.5 h-3.5" />
              Pedido min. {formatCurrency(displaySettings.minimumOrderCents / 100)}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          className="pl-10 h-11 rounded-xl bg-white shadow-sm border-gray-200"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedCategory(null);
          }}
        />
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px]">Categorias</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-[12px] border whitespace-nowrap transition-all shrink-0 ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/30"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-xl text-[12px] border whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/30"
              }`}
            >
              <span>{categoryIcons[cat] || "📦"}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured products */}
      {!search && !selectedCategory && featuredProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" />
            <h2 className="text-[15px]">Destaques da Casa</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* All products grouped by category when no filter */}
      {!search && !selectedCategory ? (
        <>
          {categories
            .filter((cat) => activeProducts.some((p) => p.category === cat))
            .map((cat) => {
              const catProducts = activeProducts.filter((p) => p.category === cat);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{categoryIcons[cat] || "📦"}</span>
                    <h2 className="text-[15px]">{cat}</h2>
                    <span className="text-[12px] text-muted-foreground">({catProducts.length})</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {catProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              );
            })}
        </>
      ) : (
        <div>
          <h2 className="text-[15px] mb-3">
            {selectedCategory || `Resultados para "${search}"`}
            <span className="text-muted-foreground text-[13px] ml-2">
              ({filteredProducts.length})
            </span>
          </h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-[14px]">
              <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-30" />
              Nenhum item encontrado
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}