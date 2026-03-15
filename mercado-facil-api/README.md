# Mercado Fácil API

API Rails para o SaaS Mercado Fácil (painel admin + loja pública). Cenário 1: deploy em free tiers (Render + Neon + Upstash).

## Requisitos

- Ruby 3.x
- PostgreSQL (local ou Neon/Supabase)
- Redis (local ou Upstash)

## Setup local

1. Clone o repositório e entre na pasta:
   ```bash
   cd mercado-facil-api
   ```

2. Copie as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite `.env` com `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY_BASE`, `CORS_ORIGIN`.

3. Instale dependências e crie o banco:
   ```bash
   bundle install
   rails db:create db:migrate db:seed
   ```

4. Inicie o servidor:
   ```bash
   rails server
   ```
   A API estará em `http://localhost:3000`.

## Variáveis de ambiente (produção / Render)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL do PostgreSQL (Neon, Supabase ou Render) |
| `REDIS_URL` | URL do Redis (Upstash ou Render) |
| `SECRET_KEY_BASE` | Chave secreta Rails (`rails secret`) |
| `CORS_ORIGIN` | Origem do frontend (ex.: `https://seu-app.vercel.app`) |
| `RESEND_API_KEY` | (Opcional) API key Resend para e-mails |
| `JWT_SECRET_KEY` | (Opcional) Chave para tokens JWT |

## Deploy no Render (Cenário 1)

1. Crie um **Web Service** no [Render](https://render.com) conectado ao repo desta API.
2. Build command: `bundle install && rails db:migrate`
3. Start command: `bin/rails server -e production`
4. Adicione as variáveis de ambiente (incluindo `DATABASE_URL` do Neon e `REDIS_URL` do Upstash).
5. Defina `CORS_ORIGIN` com a URL do frontend na Vercel.

## Endpoints principais

- `POST /api/v1/auth/login` — Login
- `GET /api/v1/auth/me` — Usuário atual
- `GET /api/v1/dashboard` — Métricas do painel
- `GET /api/v1/products`, `POST /api/v1/products`, etc. — CRUD por recurso
- `GET /api/v1/storefront/:slug` — Dados da loja pública
- `POST /api/v1/storefront/:slug/checkout` — Criar pedido pela loja
- `POST /api/v1/tracking/order` — Rastrear pedido (telefone + código)

Documentação completa conforme `src/imports/pasted_text/mercado-facil-product-doc.md` no repositório do frontend.
