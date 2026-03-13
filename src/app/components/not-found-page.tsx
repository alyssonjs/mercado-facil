import { Link } from "react-router";
import { Home, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Página não encontrada
        </h1>
        <p className="text-gray-500 mb-8">
          O endereço que você acessou não existe. Volte ao início para continuar.
        </p>
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Ir para o início
          </Link>
        </Button>
      </div>
    </div>
  );
}
