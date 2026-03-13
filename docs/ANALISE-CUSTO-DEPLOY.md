# Análise de custo: Mercado Fácil completo online

Com base nas especificações de **mercado-facil-product-doc.md** e **mercado-facil-saas.md**, esta análise estima o custo mensal para colocar o sistema **completo** em produção (frontend + backend + banco + Redis + armazenamento de imagens).

---

## O que “completo” significa nas especificações

- **Frontend**: painel admin + loja pública (já em Vite/React; doc sugere Next.js).
- **Backend**: API Rails com autenticação, multi-tenant, CRUD de loja, produtos, categorias, clientes, pedidos, entregas, estoque, dashboard.
- **Infra**: PostgreSQL, Redis, jobs assíncronos (Sidekiq), armazenamento de imagens (S3-compatível).
- **Funcionalidades**: login, recuperação de senha, vitrine por loja, carrinho, checkout, rastreamento de pedido, gestão de entregas, alertas de estoque.

---

## Componentes de custo

| Componente | Serviço sugerido | Uso no sistema |
|------------|------------------|----------------|
| Frontend | Vercel | SPA (admin + loja pública) |
| Backend API | Render / Railway / Fly.io | Rails API, Sidekiq |
| Banco de dados | PostgreSQL gerenciado | Dados da aplicação |
| Cache/filas | Redis | Sessões, Sidekiq |
| Imagens | S3-compatível (R2, S3, etc.) | Logo, banner, fotos de produtos |
| E-mail transacional | Resend / SendGrid | Recuperação de senha, notificações |
| Domínio | Registro.br / Cloudflare | Opcional (ex.: mercadofacil.com.br) |

---

## Cenário 1: Custo mínimo (free tiers)

Objetivo: validar produto com pouco ou nenhum custo fixo.

| Item | Serviço | Custo/mês |
|------|---------|-----------|
| Frontend | Vercel (Hobby) | **R$ 0** |
| Backend | Render Free ou Railway (limite de horas) | **R$ 0** |
| PostgreSQL | Render Free / Neon / Supabase Free | **R$ 0** |
| Redis | Upstash Free ou Redis no Render Free | **R$ 0** |
| Imagens | Cloudflare R2 (free tier) ou URLs externas | **R$ 0** |
| E-mail | Resend / SendGrid free tier | **R$ 0** |
| **Total** | | **R$ 0/mês** |

**Limitações**: backend “dorme” após inatividade (Render Free), limites de requisições e de horas; não recomendado para uso comercial estável.

---

## Cenário 2: Produção enxuta (recomendado para MVP)

Objetivo: ambiente estável, sempre ligado, com poucos clientes/lojas.

| Item | Serviço | Custo/mês (aprox.) |
|------|---------|--------------------|
| Frontend | Vercel Pro (ou Hobby se um único projeto) | **R$ 0 – 100** |
| Backend | Render Starter (~US$ 7) ou Railway | **~R$ 35–50** |
| PostgreSQL | Render / Neon / Supabase (plano pago pequeno) | **~R$ 35–70** |
| Redis | Upstash Pay-as-you-go ou Redis no Render | **R$ 0 – 50** |
| Imagens | Cloudflare R2 ou S3 (uso baixo) | **~R$ 5–20** |
| E-mail | Resend (~100 emails/dia grátis) ou SendGrid | **R$ 0 – 30** |
| **Total** | | **~R$ 75 – 220/mês** |

Valores em reais assumem câmbio aproximado (US$ 1 ≈ R$ 5–6). Na prática, um **orçamento de R$ 150–250/mês** cobre esse cenário com folga.

---

## Cenário 3: Produção com mais tráfego e redundância

Várias lojas, mais pedidos e necessidade de mais disponibilidade.

| Item | Serviço | Custo/mês (aprox.) |
|------|---------|--------------------|
| Frontend | Vercel Pro | **~R$ 100** |
| Backend | Render Standard ou Railway | **~R$ 100–200** |
| PostgreSQL | Plano pago (backup, mais recursos) | **~R$ 100–200** |
| Redis | Upstash ou Redis gerenciado | **~R$ 50–100** |
| Imagens | R2/S3 com mais armazenamento/tráfego | **~R$ 30–80** |
| E-mail | Plano pago (mais envios) | **~R$ 50–150** |
| **Total** | | **~R$ 430 – 830/mês** |

---

## Custos pontuais / anuais

| Item | Custo aproximado |
|------|-------------------|
| Domínio .com.br | ~R$ 40/ano |
| SSL | Incluso (Vercel, Render, etc.) |
| Manutenção/ajustes | Conforme contrato ou hora de dev |

---

## Resumo por fase

- **Só frontend (demo)**: **R$ 0** — Vercel + dados mock (situação atual).
- **MVP completo (backend + DB + Redis + imagens)**: **R$ 0** (só free tiers) ou **R$ 150–250/mês** (produção estável).
- **Produção com mais lojas/tráfego**: **R$ 400–800/mês**.

---

## Sugestão prática

1. **Fase 1 – Validação**: manter frontend na Vercel (R$ 0). Subir backend + PostgreSQL + Redis em free tiers (Render, Neon, Upstash) para testes e primeiros clientes. **Custo alvo: R$ 0/mês.**
2. **Fase 2 – Primeiros pagantes**: migrar backend e banco para planos pagos mínimos (ex.: Render Starter + PostgreSQL pago). Adicionar R2 ou S3 para imagens. **Custo alvo: R$ 150–250/mês.**
3. **Fase 3 – Crescimento**: aumentar plano de backend, banco e e-mail conforme número de lojas e volume de pedidos; manter domínio próprio (~R$ 40/ano).

Com os planos de cobrança sugeridos nos docs (R$ 49–119/mês por loja), **1–2 clientes pagantes** já cobrem o custo de infra do cenário 2.

---

## Referência rápida de preços (2025)

- **Vercel**: Hobby grátis; Pro ~US$ 20/mês.
- **Render**: Free (com sleep); Starter ~US$ 7/mês; PostgreSQL a partir de ~US$ 7/mês.
- **Railway**: Pay-as-you-go; ~US$ 5–20/mês para MVP.
- **Fly.io**: Pay-as-you-go; pequenos apps em torno de US$ 5–15/mês.
- **Neon/Supabase**: Free tier generoso; planos pagos a partir de ~US$ 19/mês.
- **Upstash Redis**: Free tier; depois pay-per-request.
- **Cloudflare R2**: Free tier (10 GB armazenamento, saída grátis).
- **Resend**: 3.000 emails/mês grátis; depois a partir de ~US$ 20/mês.

*Valores em dólar; conversão para reais conforme câmbio do dia.*
