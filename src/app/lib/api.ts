/**
 * API client for Mercado Fácil backend.
 * When VITE_API_URL is set, all requests go to the API; otherwise the app uses mock data.
 */

const getBaseUrl = () => import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const getToken = () => localStorage.getItem("mercado_facil_token");

export function hasApi(): boolean {
  return !!getBaseUrl();
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("mercado_facil_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.errors?.join?.(" ") || String(res.status));
  }
  return res.headers.get("content-type")?.includes("json") ? res.json() : ({} as T);
}

export const auth = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; name: string; email: string; role: string; store_id: number }; store: { id: number; name: string; slug: string } }>(
      "/api/v1/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),
  me: () =>
    request<{ user: { id: number; name: string; email: string; role: string; store_id: number }; store: { id: number; name: string; slug: string } }>(
      "/api/v1/auth/me"
    ),
  logout: () => request("/api/v1/auth/logout", { method: "POST" }),
};

export const dashboard = {
  get: () =>
    request<{
      orders_today: number;
      revenue_today_cents: number;
      ticket_medium_cents: number;
      pending_orders: number;
      deliveries_in_progress: number;
      low_stock_products: number;
    }>("/api/v1/dashboard"),
};

export const store = {
  get: () => request<{ id: number; name: string; slug: string; phone: string; email: string; address: string; active: boolean }>("/api/v1/store"),
  update: (data: Record<string, unknown>) => request("/api/v1/store", { method: "PATCH", body: JSON.stringify(data) }),
};

export const storeSettings = {
  get: () =>
    request<{
      logo_url: string;
      banner_url: string;
      primary_color: string;
      minimum_order_cents: number;
      default_delivery_fee_cents: number;
      delivery_time_minutes: number;
      accepts_cash: boolean;
      accepts_pix: boolean;
      accepts_card_on_delivery: boolean;
      opening_hours: string;
      closing_hours: string;
      active: boolean;
    }>("/api/v1/store-settings"),
  update: (data: Record<string, unknown>) => request("/api/v1/store-settings", { method: "PATCH", body: JSON.stringify(data) }),
};

export const neighborhoods = {
  list: () =>
    request<{ id: number; name: string; delivery_fee_cents: number; active: boolean }[]>("/api/v1/neighborhoods"),
  create: (data: { name: string; delivery_fee_cents?: number; active?: boolean }) =>
    request("/api/v1/neighborhoods", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/v1/neighborhoods/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request(`/api/v1/neighborhoods/${id}`, { method: "DELETE" }),
};

export const categories = {
  list: () => request<{ id: number; name: string; slug: string; active: boolean }[]>("/api/v1/categories"),
  create: (data: { name: string; slug?: string; active?: boolean }) =>
    request("/api/v1/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/v1/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request(`/api/v1/categories/${id}`, { method: "DELETE" }),
};

export const products = {
  list: (params?: { category_id?: number; active?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.category_id != null) q.set("category_id", String(params.category_id));
    if (params?.active != null) q.set("active", String(params.active));
    const query = q.toString();
    return request<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      price_cents: number;
      sale_type: string;
      unit_type: string;
      stock_quantity: number;
      minimum_stock_alert: number;
      active: boolean;
      featured: boolean;
      image_url: string | null;
      category_name: string | null;
    }[]>(`/api/v1/products${query ? `?${query}` : ""}`);
  },
  get: (id: number) => request(`/api/v1/products/${id}`),
  create: (data: Record<string, unknown>) => request("/api/v1/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/v1/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request(`/api/v1/products/${id}`, { method: "DELETE" }),
};

export const customers = {
  list: (q?: string) =>
    request<{ id: number; name: string; phone: string; email: string | null; address_line: string; neighborhood: string; notes: string | null; total_orders: number }[]>(
      `/api/v1/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`
    ),
  get: (id: number) => request(`/api/v1/customers/${id}`),
  create: (data: Record<string, unknown>) => request("/api/v1/customers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/v1/customers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request(`/api/v1/customers/${id}`, { method: "DELETE" }),
};

export type ApiOrder = {
  id: number;
  customer_id: number;
  customer_name: string;
  source: string;
  status: string;
  payment_method: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  change_for_cents: number;
  notes: string | null;
  neighborhood_snapshot: string | null;
  ordered_at: string | null;
  confirmed_at: string | null;
  delivered_at: string | null;
  created_at: string;
  items?: { product_name_snapshot: string; quantity: number; unit_type: string; total_price_cents: number }[];
};

export const orders = {
  list: (status?: string) =>
    request<ApiOrder[]>(`/api/v1/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  get: (id: number) => request<ApiOrder>(`/api/v1/orders/${id}`),
  create: (data: Record<string, unknown>) => request("/api/v1/orders", { method: "POST", body: JSON.stringify(data) }),
  confirm: (id: number) => request(`/api/v1/orders/${id}/confirm`, { method: "POST" }),
  cancel: (id: number) => request(`/api/v1/orders/${id}/cancel`, { method: "POST" }),
  changeStatus: (id: number, status: string) =>
    request(`/api/v1/orders/${id}/change_status`, { method: "POST", body: JSON.stringify({ status }) }),
};

export const deliveries = {
  list: (status?: string) =>
    request<{
      id: number;
      order_id: number;
      customer_name: string;
      address: string;
      neighborhood: string;
      delivery_user_id: number | null;
      delivery_user_name: string | null;
      status: string;
      assigned_at: string | null;
      left_for_delivery_at: string | null;
      delivered_at: string | null;
      notes: string | null;
    }[]>(`/api/v1/deliveries${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  create: (data: Record<string, unknown>) => request("/api/v1/deliveries", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/v1/deliveries/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  changeStatus: (id: number, status: string) =>
    request(`/api/v1/deliveries/${id}/change_status`, { method: "POST", body: JSON.stringify({ status }) }),
};

export const inventory = {
  list: () =>
    request<{ id: number; name: string; slug: string; stock_quantity: number; minimum_stock_alert: number; low_stock: boolean }[]>(
      "/api/v1/inventory"
    ),
  adjustments: (product_id: number, quantity: number, notes?: string) =>
    request("/api/v1/inventory/adjustments", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity, notes }),
    }),
  movements: (product_id?: number) =>
    request<{ id: number; product_id: number; product_name: string; movement_type: string; quantity: number; notes: string | null; created_at: string }[]>(
      `/api/v1/inventory/movements${product_id != null ? `?product_id=${product_id}` : ""}`
    ),
};

export const storefront = {
  get: (slug: string) =>
    request<{ store: { id: number; name: string; slug: string; phone: string; email: string; address: string }; settings: Record<string, unknown> }>(
      `/api/v1/storefront/${slug}`
    ),
  products: (slug: string, categoryId?: number) =>
    request<{ id: number; name: string; slug: string; description: string | null; price_cents: number; sale_type: string; unit_type: string; stock_quantity: number; featured: boolean; image_url: string | null; category_name: string | null }[]>(
      `/api/v1/storefront/${slug}/products${categoryId != null ? `?category_id=${categoryId}` : ""}`
    ),
  categories: (slug: string) =>
    request<{ id: number; name: string; slug: string }[]>(`/api/v1/storefront/${slug}/categories`),
  calculateDelivery: (slug: string, neighborhood: string) =>
    request<{ delivery_fee_cents: number }>(`/api/v1/storefront/${slug}/calculate-delivery`, {
      method: "POST",
      body: JSON.stringify({ neighborhood }),
    }),
  checkout: (slug: string, data: { name: string; phone: string; address: string; neighborhood: string; payment_method: string; delivery_fee_cents: number; change_for_cents?: number; notes?: string; items: { product_id: number; quantity: number }[] }) =>
    request<{ order_id: number; total_cents: number; status: string }>(`/api/v1/storefront/${slug}/checkout`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const tracking = {
  order: (orderId: string, phone: string) =>
    request<{ order_id: number; status: string; total_cents: number; created_at: string; items: { product_name: string; quantity: number; total_price_cents: number }[] }>(
      "/api/v1/tracking/order",
      { method: "POST", body: JSON.stringify({ order_id: orderId, phone }) }
    ),
};
