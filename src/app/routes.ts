import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/app-layout";
import { DashboardPage } from "./components/dashboard-page";
import { ProductsPage } from "./components/products-page";
import { OrdersPage } from "./components/orders-page";
import { CustomersPage } from "./components/customers-page";
import { DeliveriesPage } from "./components/deliveries-page";
import { InventoryPage } from "./components/inventory-page";
import { CategoriesPage } from "./components/categories-page";
import { SettingsPage } from "./components/settings-page";
import { NeighborhoodsPage } from "./components/neighborhoods-page";
import { LoginPage } from "./components/login-page";
import { LandingPage } from "./components/landing-page";
import { StoreLayout } from "./components/storefront/store-layout";
import { StoreHome } from "./components/storefront/store-home";
import { CartPage } from "./components/storefront/cart-page";
import { CheckoutPage } from "./components/storefront/checkout-page";
import { TrackingPage } from "./components/storefront/tracking-page";
import { NotFoundPage } from "./components/not-found-page";

export const router = createBrowserRouter([
  // Landing page
  { path: "/", Component: LandingPage },

  // Login
  { path: "/login", Component: LoginPage },

  // Tracking (public)
  { path: "/rastrear", Component: TrackingPage },

  // Admin panel
  {
    path: "/admin",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "pedidos", Component: OrdersPage },
      { path: "produtos", Component: ProductsPage },
      { path: "categorias", Component: CategoriesPage },
      { path: "clientes", Component: CustomersPage },
      { path: "entregas", Component: DeliveriesPage },
      { path: "estoque", Component: InventoryPage },
      { path: "bairros", Component: NeighborhoodsPage },
      { path: "configuracoes", Component: SettingsPage },
    ],
  },

  // Public storefront
  {
    path: "/loja/:slug",
    Component: StoreLayout,
    children: [
      { index: true, Component: StoreHome },
      { path: "carrinho", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
    ],
  },

  // 404 catch-all
  { path: "*", Component: NotFoundPage },
]);
