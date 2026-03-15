import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingBag, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, hasApi } = useAuth();
  const [email, setEmail] = useState("admin@mercado.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");
    if (hasApi) {
      try {
        await login(email, password);
        navigate("/admin");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao entrar");
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        navigate("/admin");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <ShoppingBag className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-[22px] text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Mercado <span className="text-primary">Facil</span>
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Acesse o painel da sua mercearia
          </p>
        </div>

        <Card className="shadow-xl shadow-black/5 border-gray-100">
          <CardContent className="py-6 space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Senha</Label>
                  <button
                    type="button"
                    className="text-[12px] text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[12px] text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[12px] text-gray-400">
                Demo: admin@mercado.com / 123456
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          Powered by <span className="text-primary">Mercado Facil</span> — SaaS para mercearias
        </p>
      </div>
    </div>
  );
}
