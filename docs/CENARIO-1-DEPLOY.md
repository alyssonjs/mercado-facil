# Cenário 1 — Deploy (custo zero)

Passo a passo para colocar o Mercado Fácil completo online usando apenas free tiers (R$ 0/mês), conforme [ANALISE-CUSTO-DEPLOY.md](ANALISE-CUSTO-DEPLOY.md).

---

## Arquitetura

- **Frontend**: Vercel (Hobby) — repositório atual (`mercado-facil-saas`).
- **Backend**: Render (Web Service, free) — repositório `mercado-facil-api` (Rails API na pasta `mercado-facil-api/` ou em repo separado).
- **PostgreSQL**: Neon ou Supabase (free tier).
- **Redis**: Upstash (free tier).
- **E-mail**: Resend (free tier).
- **Imagens**: URLs externas ou Cloudflare R2 (free) — opcional.

---

## 1. Backend (Rails API)

### 1.1 Repositório

- O código da API está em `mercado-facil-api/` (ou em um repositório GitHub separado, ex.: `mercado-facil-api`).
- Requisitos: Ruby 3.x, PostgreSQL, Redis.

### 1.2 Banco de dados (Neon)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta.
2. Crie um projeto e um banco.
3. Copie a **connection string** (ex.: `postgresql://user:pass@host/db?sslmode=require`).

### 1.3 Redis (Upstash)

1. Acesse [upstash.com](https://upstash.com) e crie uma conta.
2. Crie um banco Redis.
3. Copie a URL (ex.: `rediss://default:xxx@xxx.upstash.io:6379`).

### 1.4 Deploy no Render

1. Acesse [render.com](https://render.com) e conecte o repositório do backend.
2. Crie um **Web Service**:
   - **Build Command**: `bundle install && rails db:migrate`
   - **Start Command**: `bin/rails server -e production -p $PORT`
   - **Environment**: adicione:
     - `DATABASE_URL` = connection string do Neon
     - `REDIS_URL` = URL do Upstash
     - `SECRET_KEY_BASE` = gere com `rails secret`
     - `CORS_ORIGIN` = URL do frontend na Vercel (ex.: `https://mercado-facil-saas.vercel.app`)
     - `JWT_SECRET_KEY` = opcional (ou use o mesmo que `SECRET_KEY_BASE`)
3. Após o primeiro deploy, rode as seeds (Shell no Render ou one-off):  
   `bundle exec rails db:seed`
4. Anote a URL do serviço (ex.: `https://mercado-facil-api.onrender.com`).

### 1.5 Limitações (Render Free)

- O serviço **dorme** após ~15 min sem requisições.
- A primeira requisição após dormir pode levar **30–60 segundos** (cold start).
- Adequado para validação e testes; para produção estável, use Cenário 2 (plano pago).

---

## 2. Frontend (Vercel)

1. Conecte o repositório do frontend à Vercel (já configurado com `vercel.json` para SPA).
2. Em **Settings → Environment Variables**, adicione:
   - **Name**: `VITE_API_URL`  
   - **Value**: URL do backend no Render (ex.: `https://mercado-facil-api.onrender.com`)  
   - **Environment**: Production (e Preview se quiser).
3. Faça um novo deploy para que a variável seja aplicada.

Com `VITE_API_URL` definido, o frontend passa a usar a API (login, dashboard, etc.). Sem a variável, continua usando dados mock.

---

## 3. Checklist Cenário 1

- [ ] Backend no Render com `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY_BASE`, `CORS_ORIGIN`
- [ ] Migrations e seeds rodados no backend
- [ ] Frontend na Vercel com `VITE_API_URL` apontando para o backend
- [ ] Login com `admin@mercado.com` / `123456` funciona
- [ ] Dashboard carrega métricas da API
- [ ] Loja pública `/loja/mercado-boa-vista` carrega (storefront)
- [ ] Rastreamento `/rastrear` com `order_id` + telefone retorna status (quando houver pedido)

---

## 4. Variáveis de ambiente — resumo

| Onde    | Variável          | Exemplo / descrição                          |
|---------|-------------------|-----------------------------------------------|
| Render  | `DATABASE_URL`    | URL PostgreSQL (Neon)                        |
| Render  | `REDIS_URL`       | URL Redis (Upstash)                           |
| Render  | `SECRET_KEY_BASE` | `rails secret`                                |
| Render  | `CORS_ORIGIN`     | URL do app na Vercel                         |
| Vercel  | `VITE_API_URL`    | URL do Web Service no Render (sem barra final)|

---

## 5. Próximos passos (Cenário 2)

Para ambiente estável e sempre ligado:

- Render: plano **Starter** para o backend e PostgreSQL.
- Manter Upstash ou usar Redis gerenciado no Render.
- Configurar domínio próprio (opcional) e ajustar `CORS_ORIGIN` e links.
