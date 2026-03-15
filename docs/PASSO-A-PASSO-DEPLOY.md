# Passo a passo: como adicionar Neon, Render e Vercel

Ordem recomendada: **1 → 2 → 3**. Anote cada URL/valor que gerar para usar nos próximos passos.

---

## 1. Neon (PostgreSQL) e Upstash (Redis)

### 1.1 Neon — banco PostgreSQL

1. Acesse **https://neon.tech** e faça login (ou crie conta com GitHub).
2. Clique em **New Project**.
3. Dê um nome (ex.: `mercado-facil`), escolha a região e clique em **Create Project**.
4. Na tela do projeto, em **Connection Details**, copie a **connection string** (botão "Copy").
   - Formato: `postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
5. **Guarde** essa URL como `DATABASE_URL` (vai usar no Render no passo 2).

### 1.2 Upstash — Redis

1. Acesse **https://upstash.com** e faça login (ou crie conta).
2. No dashboard, clique em **Create Database**.
3. Nome (ex.: `mercado-facil`), região, deixe **Free** e clique em **Create**.
4. Na página do banco, em **REST API** ou **Details**, copie a **URL** (Endpoint).
   - Formato: `rediss://default:TOKEN@xxx.upstash.io:6379`
5. **Guarde** essa URL como `REDIS_URL` (vai usar no Render no passo 2).

---

## 2. Render (API) com env vars e db:seed

### 2.1 Gerar SECRET_KEY_BASE (no seu PC)

No terminal, na pasta do projeto (ou em qualquer pasta com Ruby):

```bash
cd mercado-facil-api
bundle exec rails secret
```

Copie o valor gerado e **guarde** como `SECRET_KEY_BASE`.

### 2.2 Criar o Web Service no Render

1. Acesse **https://render.com** e faça login (conecte com GitHub).
2. Clique em **New +** → **Web Service**.
3. Conecte o repositório onde está o código:
   - Se a API está na pasta **`mercado-facil-api/`** do mesmo repositório do frontend, conecte esse repo e informe:
     - **Root Directory**: `mercado-facil-api`
   - Se a API está em um repositório separado, conecte esse repositório (sem Root Directory).
4. Configure:
   - **Name**: ex. `mercado-facil-api`
   - **Region**: escolha a mais próxima (ex. Oregon).
   - **Branch**: `main` (ou a branch que você usa).
   - **Runtime**: **Ruby**.
   - **Build Command**:  
     `bundle install && rails db:migrate`
   - **Start Command**:  
     `bin/rails server -e production -p $PORT`

### 2.3 Variáveis de ambiente no Render

Ainda na criação (ou em **Environment** depois):

1. Clique em **Add Environment Variable**.
2. Adicione uma a uma:

| Key                 | Value                                                                 |
|---------------------|-----------------------------------------------------------------------|
| `DATABASE_URL`      | Cole a connection string do **Neon** (passo 1.1)                     |
| `REDIS_URL`         | Cole a URL do **Upstash** (passo 1.2)                                 |
| `SECRET_KEY_BASE`   | Cole o valor gerado com `rails secret` (passo 2.1)                    |
| `CORS_ORIGIN`       | URL do frontend na Vercel (ex.: `https://seu-app.vercel.app`) **Sem barra no final** |

- **Importante**: `CORS_ORIGIN` você só vai saber depois de publicar na Vercel. Pode deixar em branco no primeiro deploy e, assim que tiver a URL da Vercel, editar o serviço no Render → **Environment** → adicionar ou alterar `CORS_ORIGIN` e fazer **Manual Deploy**.

3. Clique em **Create Web Service**.
4. Aguarde o build e o deploy. Se der erro, confira as variáveis e os comandos.
5. **Anote a URL do serviço** (ex.: `https://mercado-facil-api.onrender.com`). Será o valor de `VITE_API_URL` na Vercel.

### 2.4 Rodar as seeds no Render

Depois do primeiro deploy bem-sucedido:

1. No Render, abra o seu **Web Service**.
2. Vá na aba **Shell** (ou **Manual Deploy** com comando customizado, conforme a interface).
3. Se houver **Shell**:
   - Abra o shell e rode:  
     `bundle exec rails db:seed`
4. Se não houver Shell, use **Background Worker** ou um **one-off job** (se o plano tiver), com o mesmo comando:  
   `bundle exec rails db:seed`

Isso cria o usuário de teste `admin@mercado.com` / `123456` e dados iniciais.

---

## 3. Vercel (frontend) com VITE_API_URL e redeploy

### 3.1 Conectar o repositório (se ainda não conectou)

1. Acesse **https://vercel.com** e faça login (conecte com GitHub).
2. **Add New** → **Project**.
3. Importe o repositório do frontend (onde está o `package.json` e o código React).
4. **Root Directory**: deixe em branco (raiz do repo).
5. **Build Command**: `npm run build` (já deve vir preenchido).
6. **Output Directory**: `dist` (padrão do Vite).
7. Avance sem adicionar env vars ainda e faça o primeiro deploy (só para ter a URL).

### 3.2 Adicionar VITE_API_URL e redeploy

1. No projeto na Vercel, vá em **Settings** → **Environment Variables**.
2. Clique em **Add New**.
3. Preencha:
   - **Name**: `VITE_API_URL`
   - **Value**: URL do backend no **Render** (passo 2.5), **sem barra no final**  
     Ex.: `https://mercado-facil-api.onrender.com`
   - **Environment**: marque **Production** (e **Preview** se quiser que previews também usem a API).
4. Salve.
5. Volte em **Deployments**, abra o menu (três pontinhos) do último deploy e clique em **Redeploy** (ou faça um novo commit e deixar redeployar sozinho).

Depois do redeploy, o frontend passa a usar a API (login, dashboard, loja, checkout, rastreamento).

### 3.3 Atualizar CORS no Render (se você não tinha a URL da Vercel)

1. No Render, abra o **Web Service** da API.
2. **Environment** → edite `CORS_ORIGIN` e coloque a URL do app na Vercel (ex.: `https://seu-projeto.vercel.app`), **sem barra no final**.
3. Salve e faça **Manual Deploy** se precisar.

---

## Resumo rápido

| Onde   | O que adicionar |
|--------|------------------|
| **Neon** | Criar projeto → copiar **connection string** → usar como `DATABASE_URL` no Render. |
| **Upstash** | Criar database → copiar **URL** → usar como `REDIS_URL` no Render. |
| **Render** | Web Service com Root Directory `mercado-facil-api` (se for monorepo), Build/Start acima, env vars `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY_BASE`, `CORS_ORIGIN` → depois rodar `bundle exec rails db:seed`. |
| **Vercel** | Env var `VITE_API_URL` = URL do Render (sem barra) → Redeploy. |

Documentação completa do Cenário 1: [CENARIO-1-DEPLOY.md](CENARIO-1-DEPLOY.md).
