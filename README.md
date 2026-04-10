# VEM Platform — B2B
### Plataforma de gestão de acompanhamentos para hospitais, clínicas e residências

---

## Estrutura do projeto

```
vem-platform/
├── app/
│   ├── dashboard/page.tsx      ← Analytics + KPIs
│   ├── pedidos/page.tsx        ← Gestão de pedidos
│   ├── guias/page.tsx          ← Gestão de guias VEM
│   ├── instituicoes/page.tsx   ← Instituições parceiras
│   ├── login/page.tsx          ← Autenticação
│   ├── layout.tsx              ← Layout + sidebar
│   └── globals.css             ← Estilos globais VEM
├── components/
│   ├── layout/Sidebar.tsx      ← Navegação lateral
│   └── charts/                 ← Todos os componentes do dashboard
│       ├── KpiCards.tsx
│       ├── WeeklyChart.tsx
│       ├── TipoChart.tsx
│       ├── SatisfacaoChart.tsx
│       ├── TopGuias.tsx
│       ├── PedidosPorInstituicao.tsx
│       └── PedidosRecentes.tsx
├── lib/
│   ├── supabase.ts             ← Cliente Supabase
│   └── data.ts                 ← Todas as queries à BD
├── types/
│   └── database.ts             ← Tipos TypeScript
└── supabase-schema.sql         ← Schema completo + dados demo
```

---

## Setup em 15 minutos

### 1. Criar projeto Supabase (gratuito)
1. Ir a [supabase.com](https://supabase.com) → New Project
2. Nome: `vem-platform`, escolher região `West Europe`
3. Guardar a password gerada
4. Aguardar ~2 min até o projeto estar pronto

### 2. Criar a base de dados
1. No painel Supabase → **SQL Editor**
2. Copiar o conteúdo de `supabase-schema.sql`
3. Clicar **Run** — cria todas as tabelas, views e dados demo

### 3. Configurar variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Preencher com os valores de **Supabase → Settings → API**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 4. Instalar e correr
```bash
npm install
npm run dev
```
Abrir [http://localhost:3000](http://localhost:3000)

---

## Deploy em produção (Vercel — gratuito)

```bash
npm install -g vercel
vercel
```
Ou ligar o repositório GitHub em [vercel.com](https://vercel.com) e adicionar as env vars.

URL final: `https://vem-platform.vercel.app`

---

## Stack técnica

| Camada       | Tecnologia              | Custo         |
|-------------|-------------------------|---------------|
| Frontend    | Next.js 14 + TypeScript | Gratuito      |
| Estilos     | Tailwind CSS            | Gratuito      |
| Gráficos    | Chart.js + react-chartjs-2 | Gratuito   |
| Base dados  | Supabase (PostgreSQL)   | Gratuito até 500MB |
| Auth        | Supabase Auth           | Gratuito      |
| Deploy      | Vercel                  | Gratuito      |
| **Total**   |                         | **€0/mês**    |

---

## Páginas disponíveis

| URL                | Descrição                          |
|--------------------|------------------------------------|
| `/dashboard`       | Analytics: KPIs, gráficos, ranking |
| `/pedidos`         | Lista e gestão de pedidos          |
| `/guias`           | Perfis e disponibilidade dos guias |
| `/instituicoes`    | Parceiros B2B e aprovações         |
| `/login`           | Autenticação                       |

---

## Próximos passos — Versão 2

- [ ] Formulário de criação de pedidos com seleção de utente
- [ ] Modal de atribuição de guia com notas clínicas
- [ ] Notificações por email (Resend)
- [ ] Vista mobile para os guias em campo
- [ ] Relatório mensal exportável por instituição (PDF)
- [ ] Integração WhatsApp para confirmações

---

*VEM — Mobilidade com Dignidade · vem.com.pt*
