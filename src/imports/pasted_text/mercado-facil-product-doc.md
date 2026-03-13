# SaaS para Pequenas Mercearias e Hortifrutis com Marketplace Próprio
## Documento base de produto, MVP e arquitetura
## Objetivo: construir uma aplicação simples, barata e vendável rapidamente

---

# 1. Visão do produto

## Nome provisório
Mercado Fácil

## Resumo
O Mercado Fácil é um SaaS para pequenas mercearias, hortifrutis e mercadinhos de bairro que precisam vender online e organizar sua operação diária.

A plataforma terá duas áreas principais:

1. Painel administrativo da loja
2. Loja online / marketplace da própria mercearia

O objetivo é permitir que cada mercearia tenha sua própria vitrine digital para vender produtos, receber pedidos, organizar entregas, controlar estoque básico e acompanhar clientes, tudo em um sistema simples e acessível.

## Problema que resolve
Hoje muitos pequenos mercados operam com:
- pedidos bagunçados no WhatsApp
- falta de controle de entregas
- catálogo informal ou inexistente
- dificuldade de acompanhar clientes recorrentes
- pouca visibilidade do estoque
- ausência de uma loja online própria

## Proposta de valor
Monte sua mercearia online e organize pedidos, entregas e estoque em um só sistema.

## Público-alvo
- mercearias de bairro
- hortifrutis
- mini mercados
- lojas de produtos naturais
- pequenos mercados com entrega local
- comércios que hoje vendem por WhatsApp e querem digitalizar a operação

---

# 2. Conceito do produto

## Estrutura geral
O sistema será composto por duas frentes:

### 2.1 Painel administrativo da mercearia
Área usada por dono, atendentes e entregadores para:
- cadastrar produtos
- organizar categorias
- gerenciar clientes
- acompanhar pedidos
- controlar entregas
- controlar estoque básico
- visualizar relatórios simples

### 2.2 Loja online da mercearia
Área pública onde o cliente final pode:
- ver produtos
- navegar por categorias
- pesquisar itens
- adicionar ao carrinho
- escolher endereço
- selecionar forma de pagamento
- solicitar entrega
- acompanhar status do pedido

## Modelo recomendado
O modelo ideal para o MVP é:
**marketplace por loja**

Ou seja:
- cada mercearia terá sua própria vitrine pública
- o cliente compra dentro da página da loja
- não será um marketplace geral com várias lojas concorrendo lado a lado inicialmente

### Exemplo de rota pública
- `/loja/mercearia-do-bairro`
- `/loja/hortifruti-verde`

---

# 3. Objetivo do MVP

O MVP precisa permitir que uma pequena mercearia:
- cadastre seus produtos
- tenha sua loja online própria
- receba pedidos de clientes
- acompanhe o fluxo do pedido
- organize entregas
- controle estoque básico
- visualize métricas simples de operação

## O MVP precisa entregar
1. autenticação e multi-tenant por loja
2. cadastro da loja
3. cadastro de produtos e categorias
4. cadastro de clientes
5. vitrine pública por loja
6. carrinho
7. checkout simples
8. criação e gestão de pedidos
9. controle de entregas
10. controle básico de estoque
11. dashboard administrativo

## O MVP não precisa ter agora
- emissão fiscal
- app nativo mobile
- integração oficial com WhatsApp API
- gateway de pagamento sofisticado
- roteirização avançada
- multi-filial
- marketplace aberto com múltiplas lojas na mesma home
- ERP financeiro completo
- BI avançado

---

# 4. Funcionalidades do MVP

# 4.1 Autenticação
- login por email e senha
- recuperação de senha
- sessão autenticada
- controle de acesso por perfil
- isolamento por loja via `store_id`

# 4.2 Gestão da loja
Cada loja deve poder configurar:
- nome
- slug único
- telefone
- email
- endereço
- horário de funcionamento
- taxa de entrega padrão
- pedido mínimo
- logo
- banner
- cor principal
- métodos de pagamento aceitos
- tempo estimado de entrega

# 4.3 Produtos
Cada produto deve ter:
- nome
- categoria
- descrição curta
- preço
- tipo de venda
- unidade de medida
- estoque disponível
- estoque mínimo para alerta
- ativo/inativo
- imagem opcional
- destaque opcional

## Tipos de venda
- unidade
- peso

## Unidades possíveis
- un
- kg
- g
- cx
- maço
- bandeja

# 4.4 Categorias
Exemplos:
- frutas
- verduras
- legumes
- mercearia geral
- bebidas
- higiene
- limpeza
- congelados
- outros

# 4.5 Clientes
Cada cliente deve ter:
- nome
- telefone
- email opcional
- endereço
- bairro
- complemento
- observações
- histórico de pedidos

# 4.6 Pedidos
Pedido pode ser criado:
- pelo cliente na loja online
- manualmente no painel admin

Campos do pedido:
- cliente
- itens
- subtotal
- taxa de entrega
- total
- forma de pagamento
- troco para quanto
- observações
- status
- endereço de entrega
- bairro
- origem do pedido

## Origem do pedido
- admin
- marketplace

# 4.7 Status do pedido
Sugestão inicial:
- pendente
- confirmado
- em separação
- pronto para entrega
- saiu para entrega
- entregue
- cancelado

# 4.8 Entregas
- associar entregador ao pedido
- horário previsto
- status da entrega
- observações do entregador
- visualizar pedidos em rota

# 4.9 Estoque básico
- quantidade atual
- baixa automática ao confirmar pedido
- alerta de estoque baixo
- produto indisponível ao zerar
- histórico de movimentação

# 4.10 Dashboard
Exibir:
- pedidos do dia
- faturamento do dia
- ticket médio
- entregas em andamento
- produtos mais vendidos
- pedidos pendentes
- produtos com estoque baixo

# 4.11 Loja online
A loja pública deve permitir:
- ver produtos disponíveis
- visualizar categorias
- pesquisar produtos
- adicionar ao carrinho
- revisar carrinho
- informar endereço
- escolher bairro
- validar taxa de entrega
- escolher pagamento
- confirmar pedido
- acompanhar pedido

---

# 5. Diferencial competitivo

O produto não deve ser vendido como ERP complexo.

## Posicionamento
Plataforma simples para pequenas mercearias venderem online e organizarem pedidos e entregas.

## Diferenciais
- cada loja ganha sua própria vitrine online
- sistema simples e barato
- foco em operação real de bairro
- fácil de usar
- ideal para quem vende por WhatsApp
- não exige estrutura complexa

## Pitch curto
Venda online e organize sua mercearia em um só lugar.

## Pitch comercial
Uma plataforma simples para pequenas mercearias criarem sua loja online, receberem pedidos, controlarem entregas e organizarem a operação.

---

# 6. Modelo de cobrança

## Sugestão de planos
### Plano Básico — R$ 49/mês
- painel administrativo
- produtos
- categorias
- clientes
- pedidos

### Plano Loja Online — R$ 79/mês
- tudo do Básico
- vitrine online da loja
- carrinho
- checkout
- pedidos pelo cliente

### Plano Completo — R$ 119/mês
- tudo acima
- entregas
- estoque básico
- dashboard
- bairros com taxas

## Estratégia comercial
- teste grátis de 7 dias
- onboarding assistido
- implantação simples
- foco em pequenos comerciantes locais
- venda com demonstração curta

---

# 7. Arquitetura técnica

## Stack recomendada

### Frontend
- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query

### Backend
- Ruby on Rails API-only
- PostgreSQL
- Redis
- Sidekiq
- Active Storage

### Infra
- Vercel para frontend
- Render / Railway / Fly.io para backend
- PostgreSQL gerenciado
- Redis gerenciado
- S3 compatível para imagens

## Motivo dessa stack
- rápida para desenvolver
- barata para começar
- boa para CRUD e regras de negócio
- ótima para separar admin e vitrine pública
- fácil de manter

---

# 8. Arquitetura funcional

## Camadas

### Frontend Next.js
Responsável por:
- painel admin
- páginas públicas da loja
- carrinho e checkout
- interface do cliente
- rastreamento de pedido

### Backend Rails API
Responsável por:
- autenticação
- autorização
- multi-tenant
- catálogo
- pedidos
- entregas
- estoque
- dashboard
- regras de checkout

### Jobs assíncronos
Responsáveis por:
- notificações futuras
- emails
- geração de relatórios
- alertas de estoque
- integrações futuras

---

# 9. Multi-tenant

## Estratégia inicial
Usar multi-tenant lógico por coluna `store_id`.

Cada dado importante pertence a uma loja:
- users
- categories
- products
- customers
- orders
- order_items
- deliveries
- stock_movements
- neighborhoods
- store_settings

## Vantagens
- simples
- barato
- rápido de implementar
- escalável para MVP

---

# 10. Perfis de usuário

## Admin
Pode:
- gerenciar tudo
- configurar loja
- cadastrar usuários
- ver dashboard
- editar estoque
- gerenciar pedidos e entregas

## Atendente
Pode:
- criar pedidos
- editar pedidos
- consultar clientes
- atualizar status
- acompanhar catálogo

## Entregador
Pode:
- ver entregas atribuídas
- marcar saiu para entrega
- marcar entregue
- adicionar observações

## Cliente final
Na loja online pode:
- navegar no catálogo
- montar carrinho
- informar endereço
- fazer pedido
- acompanhar pedido

---

# 11. Modelagem de dados

## Tabelas principais

### stores
- id
- name
- slug
- phone
- email
- address
- active
- created_at
- updated_at

### store_settings
- id
- store_id
- logo_url
- banner_url
- primary_color
- secondary_color
- minimum_order_cents
- default_delivery_fee_cents
- delivery_time_minutes
- accepts_cash
- accepts_pix
- accepts_card_on_delivery
- opening_hours_json
- active
- created_at
- updated_at

### neighborhoods
- id
- store_id
- name
- delivery_fee_cents
- active
- created_at
- updated_at

### users
- id
- store_id
- name
- email
- password_digest
- role
- active
- created_at
- updated_at

### categories
- id
- store_id
- name
- slug
- active
- created_at
- updated_at

### products
- id
- store_id
- category_id
- name
- slug
- description
- price_cents
- sale_type
- unit_type
- stock_quantity
- minimum_stock_alert
- active
- featured
- image_url
- created_at
- updated_at

### customers
- id
- store_id
- name
- phone
- email
- address_line
- neighborhood
- city
- state
- zip_code
- complement
- reference_note
- notes
- created_at
- updated_at

### orders
- id
- store_id
- customer_id
- created_by_id
- source
- status
- payment_method
- subtotal_cents
- delivery_fee_cents
- total_cents
- change_for_cents
- notes
- delivery_address_snapshot
- neighborhood_snapshot
- ordered_at
- confirmed_at
- delivered_at
- canceled_at
- created_at
- updated_at

### order_items
- id
- order_id
- product_id
- product_name_snapshot
- unit_type
- quantity
- unit_price_cents
- total_price_cents
- created_at
- updated_at

### deliveries
- id
- store_id
- order_id
- delivery_user_id
- status
- assigned_at
- left_for_delivery_at
- delivered_at
- notes
- created_at
- updated_at

### stock_movements
- id
- store_id
- product_id
- movement_type
- quantity
- reference_type
- reference_id
- notes
- created_at
- updated_at

---

# 12. Regras de negócio

## Loja
- store deve ter slug único
- loja pode ser ativada ou desativada
- loja deve respeitar horário de funcionamento
- checkout deve validar se a loja está aberta

## Produtos
- produto inativo não pode ser vendido
- produto sem estoque não pode ser comprado
- preço deve ser maior que zero
- produtos por peso aceitam quantidade decimal
- produtos por unidade aceitam quantidade inteira

## Checkout
- pedido precisa ter pelo menos 1 item
- pedido deve respeitar pedido mínimo da loja
- bairro deve estar habilitado
- taxa de entrega pode variar por bairro
- total = subtotal + taxa de entrega
- pedido só pode ser criado com produtos disponíveis

## Pedidos
- pedidos do marketplace entram no fluxo operacional da loja
- snapshots de nome e preço devem ser gravados em `order_items`
- pedido cancelado deve devolver estoque se já tiver baixado
- pedido entregue não pode voltar para pendente

## Entregas
- pedido precisa estar pronto antes de sair para entrega
- entrega concluída marca pedido como entregue
- entregador só vê entregas atribuídas a ele

## Estoque
- toda baixa deve gerar histórico
- entrada manual deve ser possível
- cancelamento pode restaurar estoque
- produto com estoque crítico deve gerar alerta visual

---

# 13. Fluxos principais

## Fluxo 1: dono cadastra loja
1. cria conta
2. informa nome da loja
3. gera slug
4. configura dados básicos
5. adiciona bairros atendidos

## Fluxo 2: cadastro de produtos
1. admin acessa Produtos
2. cria categorias
3. cadastra produtos com preço, unidade e estoque
4. ativa produtos
5. produtos aparecem na vitrine pública

## Fluxo 3: cliente faz pedido
1. cliente entra em `/loja/[slug]`
2. navega nas categorias
3. adiciona itens ao carrinho
4. revisa carrinho
5. informa nome, telefone e endereço
6. escolhe bairro
7. sistema calcula taxa
8. escolhe pagamento
9. confirma pedido
10. pedido entra como pendente

## Fluxo 4: loja processa pedido
1. atendente vê novo pedido
2. confirma pedido
3. estoque é baixado
4. pedido vai para separação
5. pedido fica pronto para entrega

## Fluxo 5: entrega
1. admin atribui entregador
2. entregador marca saiu para entrega
3. entregador marca entregue
4. pedido finaliza como entregue

## Fluxo 6: cancelamento
1. pedido é cancelado
2. estoque é restaurado se já baixado
3. histórico é mantido

---

# 14. Telas do painel administrativo

## 14.1 Login
- email
- senha
- recuperar senha

## 14.2 Dashboard
- cards com métricas
- pedidos recentes
- estoque baixo
- entregas em andamento

## 14.3 Produtos
- listagem
- filtros
- novo produto
- editar produto
- ativar/inativar

## 14.4 Categorias
- CRUD simples

## 14.5 Clientes
- listagem
- busca
- cadastro
- histórico de pedidos

## 14.6 Pedidos
- listagem
- filtros por status
- detalhe do pedido
- alterar status
- cancelar pedido

## 14.7 Entregas
- pedidos prontos
- atribuição de entregador
- painel do dia

## 14.8 Estoque
- estoque atual
- alertas
- movimentações
- ajustes manuais

## 14.9 Usuários
- admins
- atendentes
- entregadores

## 14.10 Configurações
- dados da loja
- logo/banner
- pedido mínimo
- métodos de pagamento
- horário
- bairros e taxas

---

# 15. Telas da loja online

## 15.1 Home da loja
- logo
- banner
- nome da loja
- horários
- categorias
- produtos em destaque

## 15.2 Lista de produtos
- cards de produto
- imagem
- nome
- preço
- unidade
- botão adicionar

## 15.3 Categoria
- produtos filtrados por categoria

## 15.4 Busca
- pesquisa por nome

## 15.5 Carrinho
- itens
- quantidades
- subtotal
- taxa estimada
- total

## 15.6 Checkout
- nome
- telefone
- endereço
- bairro
- complemento
- observações
- forma de pagamento
- troco para quanto

## 15.7 Confirmação do pedido
- número/código do pedido
- status inicial
- resumo do pedido

## 15.8 Rastreamento simples
- cliente informa telefone + código do pedido
- vê status atual

---

# 16. Estrutura sugerida do frontend Next.js

src/
  app/
    (public)/
      loja/[slug]/page.tsx
      loja/[slug]/categoria/[categorySlug]/page.tsx
      loja/[slug]/produto/[productSlug]/page.tsx
      loja/[slug]/carrinho/page.tsx
      loja/[slug]/checkout/page.tsx
      pedido/rastrear/page.tsx

    (auth)/
      login/page.tsx
      forgot-password/page.tsx

    (dashboard)/
      dashboard/page.tsx
      products/page.tsx
      products/new/page.tsx
      products/[id]/edit/page.tsx
      categories/page.tsx
      customers/page.tsx
      customers/new/page.tsx
      customers/[id]/page.tsx
      orders/page.tsx
      orders/[id]/page.tsx
      deliveries/page.tsx
      inventory/page.tsx
      users/page.tsx
      settings/page.tsx
      neighborhoods/page.tsx

    layout.tsx
    page.tsx

  components/
    ui/
    public-store/
    checkout/
    cart/
    dashboard/
    products/
    customers/
    orders/
    deliveries/
    inventory/

  services/
    api.ts
    auth.ts
    stores.ts
    products.ts
    categories.ts
    customers.ts
    orders.ts
    deliveries.ts
    inventory.ts
    checkout.ts
    public-store.ts

  hooks/
    useAuth.ts
    useCart.ts
    useProducts.ts
    useOrders.ts
    useStorefront.ts

  lib/
    utils.ts
    currency.ts
    permissions.ts
    query-client.ts

  types/
    store.ts
    product.ts
    order.ts
    customer.ts
    delivery.ts
    cart.ts

---

# 17. Estrutura sugerida do backend Rails

app/
  controllers/
    api/v1/
      auth_controller.rb
      dashboard_controller.rb
      stores_controller.rb
      store_settings_controller.rb
      neighborhoods_controller.rb
      products_controller.rb
      categories_controller.rb
      customers_controller.rb
      orders_controller.rb
      deliveries_controller.rb
      inventory_controller.rb
      users_controller.rb
      storefront_controller.rb
      checkout_controller.rb
      tracking_controller.rb

  models/
    store.rb
    store_setting.rb
    neighborhood.rb
    user.rb
    category.rb
    product.rb
    customer.rb
    order.rb
    order_item.rb
    delivery.rb
    stock_movement.rb

  services/
    orders/
      create_order.rb
      confirm_order.rb
      cancel_order.rb
      change_status.rb
    inventory/
      reserve_stock.rb
      restore_stock.rb
      adjust_stock.rb
    storefront/
      load_store.rb
      list_products.rb
      checkout_validator.rb
      create_marketplace_order.rb
    dashboard/
      summary_builder.rb

  serializers/
  policies/
  jobs/

config/
  routes.rb

spec/
  requests/
  models/
  services/

---

# 18. Endpoints sugeridos da API

## Auth
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET /api/v1/auth/me

## Dashboard
GET /api/v1/dashboard

## Store
GET /api/v1/store
PATCH /api/v1/store

## Store settings
GET /api/v1/store-settings
PATCH /api/v1/store-settings

## Neighborhoods
GET /api/v1/neighborhoods
POST /api/v1/neighborhoods
PATCH /api/v1/neighborhoods/:id
DELETE /api/v1/neighborhoods/:id

## Products
GET /api/v1/products
POST /api/v1/products
GET /api/v1/products/:id
PATCH /api/v1/products/:id
DELETE /api/v1/products/:id

## Categories
GET /api/v1/categories
POST /api/v1/categories
PATCH /api/v1/categories/:id
DELETE /api/v1/categories/:id

## Customers
GET /api/v1/customers
POST /api/v1/customers
GET /api/v1/customers/:id
PATCH /api/v1/customers/:id

## Orders
GET /api/v1/orders
POST /api/v1/orders
GET /api/v1/orders/:id
POST /api/v1/orders/:id/confirm
POST /api/v1/orders/:id/cancel
POST /api/v1/orders/:id/change-status

## Deliveries
GET /api/v1/deliveries
POST /api/v1/deliveries
PATCH /api/v1/deliveries/:id
POST /api/v1/deliveries/:id/change-status

## Inventory
GET /api/v1/inventory
POST /api/v1/inventory/adjustments
GET /api/v1/inventory/movements

## Users
GET /api/v1/users
POST /api/v1/users
PATCH /api/v1/users/:id

## Storefront público
GET /api/v1/storefront/:slug
GET /api/v1/storefront/:slug/categories
GET /api/v1/storefront/:slug/products
GET /api/v1/storefront/:slug/products/:product_id

## Checkout público
POST /api/v1/storefront/:slug/checkout
POST /api/v1/storefront/:slug/calculate-delivery

## Rastreamento
POST /api/v1/tracking/order

---

# 19. Dashboard - métricas iniciais

## Cards
- pedidos hoje
- faturamento hoje
- ticket médio
- entregas em andamento
- pedidos pendentes

## Listas
- últimos pedidos
- produtos com estoque baixo
- pedidos aguardando confirmação
- pedidos em rota

## Gráficos simples
- vendas últimos 7 dias
- produtos mais vendidos
- pedidos por bairro

---

# 20. UX e design

## Direção visual
O sistema deve parecer:
- amigável
- simples
- direto
- moderno
- leve

## Admin
- sidebar
- dashboard em cards
- tabelas objetivas
- formulários rápidos
- poucos cliques

## Loja online
- visual limpo
- destaque para produtos
- botão de compra fácil
- experiência rápida no celular
- checkout enxuto

## Cores sugeridas
- verde como cor principal
- branco nos cards
- cinza claro no fundo
- amarelo para alertas
- vermelho para cancelamentos/estoque crítico

---

# 21. Roadmap de construção

## Fase 1 — Base
- setup frontend
- setup backend
- autenticação
- multi-tenant
- cadastro da loja
- store settings

## Fase 2 — Catálogo
- categorias
- produtos
- imagens
- filtros

## Fase 3 — Clientes e pedidos internos
- clientes
- pedidos manuais
- order items
- status de pedido

## Fase 4 — Loja online
- página pública por loja
- catálogo
- carrinho
- checkout
- criação de pedido marketplace

## Fase 5 — Entregas e estoque
- entregadores
- atribuição de entrega
- baixa automática de estoque
- ajustes manuais
- alertas

## Fase 6 — Dashboard e acabamento
- métricas
- gráficos
- seeds
- deploy
- refinamento UX

---

# 22. Plano de desenvolvimento em sprints

## Sprint 1
- autenticação
- stores
- users
- layout admin
- dashboard base

## Sprint 2
- categories
- products
- CRUD completo
- stock básico

## Sprint 3
- customers
- orders internos
- status
- cancelamento

## Sprint 4
- storefront público
- listagem pública
- carrinho
- checkout

## Sprint 5
- deliveries
- entregadores
- bairros e taxas
- tracking

## Sprint 6
- dashboard real
- refinamentos
- seeds
- deploy

---

# 23. Seeds iniciais

Criar dados de demonstração:
- 1 loja demo
- 1 store_setting
- 3 bairros com taxas diferentes
- 1 admin
- 1 atendente
- 1 entregador
- 8 categorias
- 30 produtos
- 10 clientes
- 8 pedidos

---

# 24. Riscos e simplificações

## Riscos
- tentar virar iFood muito cedo
- fazer ERP complexo demais
- adicionar pagamento online logo no início
- adicionar app nativo cedo demais
- complicar demais o checkout

## Simplificações corretas
- cada loja com sua própria vitrine
- checkout simples
- pagamento na entrega inicialmente
- rastreamento básico
- estoque básico
- entregas simples

---

# 25. Evoluções futuras

## Versão 2
- login do cliente
- histórico de pedidos
- repetir pedido
- favoritos
- cupom de desconto
- agendamento de entrega

## Versão 3
- pagamento online
- Pix automatizado
- integração com WhatsApp
- notificações
- loja pública com SEO melhorado

## Versão 4
- app do entregador
- múltiplas filiais
- marketplace multi-loja por cidade
- programa de fidelidade
- recomendações por IA
- previsão de reposição de estoque

---

# 26. Prompt para o Cursor

Quero construir um SaaS para pequenas mercearias e hortifrutis com marketplace próprio por loja.

## Objetivo
Criar uma plataforma onde cada mercearia tenha:
1. um painel administrativo para operar o negócio
2. uma loja online pública para clientes finais fazerem pedidos

## Stack
Frontend:
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query

Backend:
- Ruby on Rails API-only
- PostgreSQL
- Redis
- Sidekiq

## Requisitos do MVP
- autenticação
- multi-tenant via store_id
- store com slug único
- store_settings
- neighborhoods com taxa de entrega
- CRUD de categorias
- CRUD de produtos
- CRUD de clientes
- pedidos internos e pedidos pelo marketplace
- carrinho
- checkout
- entregas
- estoque básico
- dashboard

## Regras principais
- cada loja possui sua vitrine pública em `/loja/[slug]`
- cliente final pode visualizar produtos, adicionar ao carrinho e finalizar pedido
- checkout deve validar:
  - loja aberta
  - pedido mínimo
  - bairro atendido
  - estoque disponível
- produtos inativos ou sem estoque não podem ser comprados
- pedido marketplace entra no fluxo interno da loja
- ao confirmar pedido, estoque deve ser reduzido
- ao cancelar pedido, estoque deve ser restaurado
- usuários podem ter perfil: admin, attendant, delivery

## Quero que você:
1. proponha a estrutura completa do projeto frontend e backend
2. gere as migrations Rails
3. gere os models com associações e validações
4. gere enums e regras de negócio
5. gere services para criação, confirmação e cancelamento de pedidos
6. gere controllers e rotas REST
7. gere páginas públicas da loja online
8. gere páginas administrativas
9. gere componentes reutilizáveis
10. gere seeds iniciais
11. siga boas práticas de organização e código limpo

Comece pela modelagem do backend e depois siga para o frontend.

---

# 27. Critério de sucesso do MVP

O MVP será considerado pronto quando:
- uma mercearia conseguir cadastrar seu catálogo
- a loja tiver uma vitrine pública funcionando
- o cliente conseguir fazer pedido online
- a loja conseguir acompanhar o pedido
- a entrega puder ser gerenciada
- o estoque básico puder ser controlado
- o dashboard mostrar a operação diária

---

# 28. Resumo final

Este produto deve ser:
- simples de construir
- barato de manter
- fácil de vender
- focado em pequenos comércios
- orientado à operação real
- mais loja online + operação do que ERP pesado

O objetivo não é criar um iFood nem um ERP completo agora.
O objetivo é criar uma plataforma simples para pequenas mercearias venderem online e organizarem pedidos e entregas.