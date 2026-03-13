import { Link } from "react-router";
import {
  Store,
  ShoppingCart,
  Truck,
  BarChart3,
  Package,
  Users,
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  ShoppingBag,
  Leaf,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { storeSettings, formatCurrency } from "../data/mock-data";

export function LandingPage() {
  const features = [
    {
      icon: Globe,
      title: "Loja Online Propria",
      description:
        "Cada mercearia ganha sua vitrine digital para vender produtos e receber pedidos online.",
      color: "text-green-600 bg-green-50",
    },
    {
      icon: ShoppingCart,
      title: "Gestao de Pedidos",
      description:
        "Receba pedidos pelo site ou crie manualmente. Acompanhe cada etapa do pedido.",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Truck,
      title: "Controle de Entregas",
      description:
        "Organize entregas por bairro, atribua entregadores e acompanhe em tempo real.",
      color: "text-orange-600 bg-orange-50",
    },
    {
      icon: Package,
      title: "Estoque Basico",
      description:
        "Controle quantidade, receba alertas de estoque baixo e acompanhe movimentacoes.",
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: Users,
      title: "Cadastro de Clientes",
      description:
        "Registre clientes, enderecos e historico de pedidos para um atendimento melhor.",
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      icon: BarChart3,
      title: "Dashboard Simples",
      description:
        "Veja vendas do dia, ticket medio, produtos mais vendidos e pedidos pendentes.",
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  const plans = [
    {
      name: "Basico",
      price: 49,
      description: "Para quem esta comecando",
      features: [
        "Painel administrativo",
        "Cadastro de produtos",
        "Cadastro de categorias",
        "Cadastro de clientes",
        "Gestao de pedidos",
      ],
      highlighted: false,
    },
    {
      name: "Loja Online",
      price: 79,
      description: "Venda online e receba pedidos",
      features: [
        "Tudo do Basico",
        "Vitrine online da loja",
        "Carrinho de compras",
        "Checkout simples",
        "Pedidos pelo cliente",
      ],
      highlighted: true,
    },
    {
      name: "Completo",
      price: 119,
      description: "Operacao completa",
      features: [
        "Tudo do Loja Online",
        "Controle de entregas",
        "Estoque basico",
        "Dashboard com metricas",
        "Bairros com taxas",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[16px] text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Mercado <span className="text-primary">Facil</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to={`/loja/${storeSettings.slug}`}>
              <Button variant="ghost" size="sm">
                Ver Loja Demo
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gap-1 rounded-xl">
                Entrar
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-green-50/80 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-green-100 text-green-700 border-green-200 mb-5 text-[12px] rounded-full px-4 py-1">
            <Leaf className="w-3 h-3 mr-1" />
            Plataforma para mercearias de bairro
          </Badge>
          <h1 className="text-[34px] sm:text-[48px] leading-[1.15] max-w-3xl mx-auto text-gray-900">
            Sua mercearia{" "}
            <span className="text-primary relative inline-block">
              online
              <div className="absolute -bottom-1 left-0 w-full h-2 bg-green-200/60 rounded-full -z-10" />
            </span>{" "}
            em um so lugar
          </h1>
          <p className="text-[16px] text-gray-500 mt-5 max-w-xl mx-auto">
            Crie sua loja online, receba pedidos, controle entregas e estoque.
            Simples, acessivel e feito para o comercio do bairro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
            <Link to={`/loja/${storeSettings.slug}`}>
              <Button size="lg" className="gap-2 rounded-xl shadow-md shadow-primary/20 px-6">
                <ShoppingBag className="w-4 h-4" />
                Ver Loja Demo
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2 rounded-xl px-6">
                Acessar Painel Admin
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="text-[12px] text-gray-400 mt-5">
            7 dias gratis — Sem cartao de credito
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] text-primary uppercase tracking-[0.2em] mb-2">Funcionalidades</p>
            <h2 className="text-[28px] text-gray-900">Tudo que sua mercearia precisa</h2>
            <p className="text-[14px] text-gray-500 mt-2">
              Simples, rapido e feito para o dia a dia do seu negocio
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card
                key={f.title}
                className="hover:shadow-md transition-all duration-200 border-gray-100 bg-white"
              >
                <CardContent className="py-6">
                  <div
                    className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}
                  >
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-[13px] text-gray-500">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] text-primary uppercase tracking-[0.2em] mb-2">Passo a Passo</p>
            <h2 className="text-[28px] text-gray-900">Como funciona</h2>
            <p className="text-[14px] text-gray-500 mt-2">
              Em 3 passos sua mercearia esta online
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Cadastre sua loja",
                description:
                  "Crie sua conta, informe dados da mercearia e configure bairros de entrega.",
                icon: Store,
                color: "bg-green-50 text-green-600",
              },
              {
                step: "2",
                title: "Adicione produtos",
                description:
                  "Cadastre seu catalogo com precos, fotos e estoque. Tudo simples e rapido.",
                icon: Package,
                color: "bg-orange-50 text-orange-600",
              },
              {
                step: "3",
                title: "Comece a vender",
                description:
                  "Compartilhe o link da sua loja e comece a receber pedidos online.",
                icon: Zap,
                color: "bg-blue-50 text-blue-600",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] text-primary bg-green-50 px-3 py-1 rounded-full mb-2">
                  PASSO {item.step}
                </div>
                <h3 className="text-[16px] text-gray-900 mb-2">{item.title}</h3>
                <p className="text-[13px] text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50/50" id="precos">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] text-primary uppercase tracking-[0.2em] mb-2">Precos</p>
            <h2 className="text-[28px] text-gray-900">Planos simples e acessiveis</h2>
            <p className="text-[14px] text-gray-500 mt-2">
              Comece com 7 dias gratis. Cancele quando quiser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-white ${
                  plan.highlighted
                    ? "border-primary border-2 shadow-lg shadow-primary/10"
                    : "border-gray-100 hover:shadow-md"
                } transition-all`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-[10px] rounded-full px-3">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="py-6 text-center">
                  <h3 className="text-[16px] text-gray-900 mb-1">Plano {plan.name}</h3>
                  <p className="text-[12px] text-gray-500 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-5">
                    <span className="text-[32px] text-primary" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      R$ {plan.price}
                    </span>
                    <span className="text-[13px] text-gray-500">
                      /mes
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-left mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-[13px] text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full rounded-xl"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Comecar Gratis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 sm:p-12 text-white shadow-xl shadow-green-600/15">
            <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-white/90" />
            <h2 className="text-white text-[24px] sm:text-[28px] mb-3">
              Pronto para digitalizar sua mercearia?
            </h2>
            <p className="text-white/80 text-[14px] mb-6 max-w-lg mx-auto">
              Pare de se perder no WhatsApp. Organize pedidos, clientes e
              entregas em um so lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-white/90 gap-2 rounded-xl shadow-md"
                >
                  Comecar Agora
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to={`/loja/${storeSettings.slug}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 gap-2 rounded-xl"
                >
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/70 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-[14px] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Mercado <span className="text-green-400">Facil</span>
              </span>
            </div>
            <p className="text-[12px]">
              2026 Mercado Facil. SaaS para mercearias de bairro.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
