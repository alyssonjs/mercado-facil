import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { storefront } from "../../lib/api";

export type StorefrontData = {
  store: { id: number; name: string; slug: string; phone: string; email: string; address: string };
  settings: Record<string, unknown>;
} | null;

type StorefrontContextType = {
  data: StorefrontData;
  loading: boolean;
  error: boolean;
};

const StorefrontContext = createContext<StorefrontContextType | null>(null);

export function StorefrontProvider({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string | undefined;
}) {
  const [data, setData] = useState<StorefrontData>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    storefront
      .get(slug)
      .then((res) => {
        setData(res);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <StorefrontContext.Provider value={{ data, loading, error }}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext);
  if (!ctx) throw new Error("useStorefront must be used within StorefrontProvider");
  return ctx;
}
