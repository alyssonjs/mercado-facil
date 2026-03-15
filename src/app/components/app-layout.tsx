import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  BarChart3,
  Settings,
  Store,
  Menu,
  X,
  LogOut,
  Bell,
  Tag,
  MapPin,
  Globe,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { storeSettings } from "../data/mock-data";
import { useAuth } from "../lib/auth";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos", badge: 3 },
  { to: "/admin/produtos", icon: Package, label: "Produtos" },
  { to: "/admin/categorias", icon: Tag, label: "Categorias" },
  { to: "/admin/clientes", icon: Users, label: "Clientes" },
  { to: "/admin/entregas", icon: Truck, label: "Entregas", badge: 2 },
  { to: "/admin/estoque", icon: BarChart3, label: "Estoque" },
  { to: "/admin/bairros", icon: MapPin, label: "Bairros" },
  { to: "/admin/configuracoes", icon: Settings, label: "Configuracoes" },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasApi, token, loading, store, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasApi && !loading && !token) navigate("/login", { replace: true });
  }, [hasApi, loading, token, navigate]);

  const storeName = (hasApi && store?.name) ? store.name : storeSettings.name;

  if (hasApi && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  if (hasApi && !token) return null;

  return (
    <div className="flex h-full min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-[15px] tracking-tight text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>Mercado Facil</h1>
            <p className="text-[11px] text-primary">{storeName}</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}

          {/* Public store link */}
          <div className="pt-3 mt-3 border-t border-border">
            <NavLink
              to={`/loja/${store?.slug ?? storeSettings.slug}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Globe className="w-[18px] h-[18px]" />
              <span>Ver Minha Loja</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[13px]">
              JA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] truncate">{user?.name ?? "Admin"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email ?? "admin@mercado.com"}</p>
            </div>
            {hasApi ? (
              <button
                type="button"
                onClick={() => { logout(); navigate("/login"); }}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <NavLink to="/login" className="p-1.5 rounded-md hover:bg-accent text-muted-foreground">
                <LogOut className="w-4 h-4" />
              </NavLink>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1" />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <div className="hidden sm:flex items-center gap-2 text-[13px] pl-3 border-l border-border">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{storeName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}