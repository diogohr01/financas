# FinanceApp — Sistema Financeiro Pessoal Full Stack

Sistema financeiro pessoal completo com React, Node.js, Supabase, IA e criptomoedas em tempo real. 100% gratuito para deploy.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS |
| UI | Componentes customizados (estilo Shadcn) + Recharts |
| Estado | Zustand + React Router |
| Backend | Node.js + Express + TypeScript (Clean Architecture) |
| Validação | Zod (frontend e backend) |
| Banco | Supabase (PostgreSQL + Auth + RLS) |
| IA | OpenRouter (modelo gratuito Mistral 7B) |
| Cripto | CoinGecko API (gratuita) |
| Deploy | Frontend: Vercel · Backend: Render · DB: Supabase |

---

## Funcionalidades

- **Autenticação**: Cadastro, login, logout, recuperação de senha (Supabase Auth)
- **Receitas**: CRUD com filtros por categoria, tipo e data
- **Despesas**: CRUD com filtros, análise por categoria
- **Metas**: Criação, acompanhamento de progresso, depósitos
- **Dashboard**: Cards de saldo, gráficos de evolução e categoria, alertas e sugestões
- **Simulações**: Juros compostos com aportes mensais para Poupança, CDB, Tesouro, Ações e Cripto
- **Criptomoedas**: Preços em tempo real via CoinGecko (BRL), sparklines de 7 dias
- **Previsões IA**: Análise dos dados + geração de previsões via OpenRouter (fallback local)
- **Relatórios**: Evolução anual, comparativo mensal, despesas por categoria
- **Segurança**: RLS no Supabase, validação Zod, rate limiting, helmet

---

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <repo>
cd finance-app
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito
2. No SQL Editor, execute o arquivo: `supabase/migrations/001_initial.sql`
3. Em **Settings > API**, copie:
   - `URL do projeto`
   - `anon public key`
   - `service_role key`

### 3. Configure o Backend

```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais
npm install
npm run dev
```

Variáveis obrigatórias no `.env`:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

### 4. Configure o Frontend

```bash
cd frontend
cp .env.example .env
# Edite .env com suas credenciais
npm install
npm run dev
```

Variáveis no `.env`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:3001/api
```

### 5. Configure a IA (opcional)

1. Crie conta em [openrouter.ai](https://openrouter.ai) (gratuito)
2. Gere uma API Key
3. Adicione no `.env` do backend:
```
AI_API_KEY=sk-or-...
AI_MODEL=mistralai/mistral-7b-instruct:free
```

Se não configurar, o sistema usa previsões baseadas em regras locais.

---

## Scripts

```bash
# Backend
npm run dev      # Desenvolvimento com hot reload
npm run build    # Compilar TypeScript
npm run start    # Produção
npm run test     # Testes

# Frontend
npm run dev      # Vite dev server (porta 5173)
npm run build    # Build para produção
npm run preview  # Preview do build
npm run test     # Vitest
```

---

## Deploy

### Frontend → Vercel

1. Faça push para GitHub
2. Importe o repositório no [vercel.com](https://vercel.com)
3. Configure **Root Directory**: `frontend`
4. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (URL do backend no Render)

### Backend → Render

1. Crie conta em [render.com](https://render.com)
2. **New Web Service** → conecte o repositório
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Adicione todas as variáveis do `.env.example`

### Banco → Supabase (já está no cloud)

Execute a migration SQL no painel do Supabase e pronto.

---

## Estrutura do Projeto

```
finance-app/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── charts/       # Recharts (evolução, categoria, simulação, sparkline)
│       │   ├── forms/        # TransactionForm
│       │   ├── layout/       # Sidebar, Navbar, AppLayout
│       │   └── ui/           # Button, Input, Select, Modal, Badge, StatCard, Toaster
│       ├── hooks/            # useAuth, useToast
│       ├── lib/              # supabase.ts, api.ts (axios), utils.ts
│       ├── pages/
│       │   ├── auth/         # Login, Register, ForgotPassword
│       │   ├── Dashboard.tsx
│       │   ├── Revenues.tsx
│       │   ├── Expenses.tsx
│       │   ├── Goals.tsx
│       │   ├── Simulations.tsx
│       │   ├── Crypto.tsx
│       │   ├── AIPredictions.tsx
│       │   └── Reports.tsx
│       ├── services/         # financeService.ts (todos os endpoints)
│       ├── store/            # authStore, uiStore (Zustand)
│       └── types/            # Interfaces TypeScript
│
├── backend/
│   └── src/
│       ├── config/           # supabase.ts, env.ts
│       ├── controllers/      # revenue, expense, goal, simulation, crypto, dashboard, prediction
│       ├── middlewares/      # auth.ts, errorHandler.ts
│       ├── repositories/     # Camada de acesso ao Supabase
│       ├── routes/           # index.ts com todas as rotas
│       ├── services/         # Lógica de negócio + IA + Cripto
│       ├── types/            # Interfaces TypeScript
│       └── validators/       # Schemas Zod
│
└── supabase/
    └── migrations/
        └── 001_initial.sql   # Tabelas + RLS + Triggers
```

---

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard/resumo` | Resumo financeiro mensal |
| GET | `/api/dashboard/evolucao` | Evolução anual |
| GET/POST | `/api/receitas` | Listar/criar receitas |
| PUT/DELETE | `/api/receitas/:id` | Atualizar/deletar |
| GET/POST | `/api/despesas` | Listar/criar despesas |
| GET | `/api/despesas/categorias` | Por categoria |
| GET/POST | `/api/metas` | Metas |
| POST | `/api/metas/:id/deposito` | Adicionar depósito |
| POST | `/api/simulacoes/calcular` | Calcular sem salvar |
| POST | `/api/simulacoes` | Salvar simulação |
| GET | `/api/crypto` | Top criptos (CoinGecko) |
| POST | `/api/previsoes/gerar` | Gerar previsões com IA |

Todos os endpoints (exceto `/health`) requerem `Authorization: Bearer <token>`.

---

## Planos Gratuitos Utilizados

| Serviço | Limite Gratuito |
|---------|----------------|
| Supabase | 500MB DB · 2GB storage · 50k auth users |
| Vercel | Projetos ilimitados · 100GB bandwidth |
| Render | 750h/mês de compute |
| CoinGecko API | 10.000 req/mês |
| OpenRouter | Modelos gratuitos disponíveis |
