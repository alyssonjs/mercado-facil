import React, { createContext, useContext, useEffect, useState } from "react";
import { hasApi, auth as apiAuth } from "./api";

type User = { id: number; name: string; email: string; role: string; storeId: number };
type Store = { id: number; name: string; slug: string };

const AuthContext = createContext<{
  token: string | null;
  user: User | null;
  store: Store | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  hasApi: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("mercado_facil_token"));
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(hasApi());

  useEffect(() => {
    if (!hasApi()) {
      setLoading(false);
      return;
    }
    if (!token) {
      setUser(null);
      setStore(null);
      setLoading(false);
      return;
    }
    apiAuth
      .me()
      .then(({ user: u, store: s }) => {
        setUser({ id: u.id, name: u.name, email: u.email, role: u.role, storeId: u.store_id });
        setStore(s ? { id: s.id, name: s.name, slug: s.slug } : null);
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem("mercado_facil_token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiAuth.login(email, password);
    localStorage.setItem("mercado_facil_token", res.token);
    setToken(res.token);
    setUser(res.user ? { id: res.user.id, name: res.user.name, email: res.user.email, role: res.user.role, storeId: res.user.store_id } : null);
    setStore(res.store ? { id: res.store.id, name: res.store.name, slug: res.store.slug } : null);
  };

  const logout = () => {
    if (hasApi()) apiAuth.logout().catch(() => {});
    localStorage.removeItem("mercado_facil_token");
    setToken(null);
    setUser(null);
    setStore(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, store, login, logout, loading, hasApi: hasApi() }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
