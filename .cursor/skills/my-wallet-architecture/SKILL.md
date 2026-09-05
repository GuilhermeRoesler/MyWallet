---
name: my-wallet-architecture
description: >-
  Arquitetura e restrições do My Wallet (React/Vite SPA sem backend).
  Use ao mudar rotas, estrutura, deploy, stack ou o modelo de produto.
---

# My Wallet — Arquitetura

## Produto

- App de **gestão financeira pessoal** para portfólio/demo
- **Sem backend, sem auth real, sem banco remoto**
- Dados 100% no **localStorage** do navegador
- Organização em **projetos** isolados; um projeto demo seedado na primeira visita
- Deploy: **GitHub Pages** via `.github/workflows/deploy-pages.yml` com `VITE_BASE_PATH=/MyWallet/`

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | React 19, Vite 8, TypeScript |
| Estilo | Tailwind CSS 4, Shadcn UI, CSS variables |
| Estado | Zustand + persistência local |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Rotas | React Router 7 (`BrowserRouter` + `basename` de `import.meta.env.BASE_URL`) |
| Temas | `next-themes` + classes CSS por tema |

Alias: `@/` → `src/` (ver `vite.config.ts`).

## Mapa de pastas

```
src/
  pages/                 # Landing, Projects, dashboard/*, NotFound
  components/
    ui/                  # Shadcn primitivos
    layout/              # DashboardLayout, Navbar, AppDock, CommandPalette
    dashboard/           # Features por domínio (accounts, budgets, …)
    projects/            # CRUD de projetos + ProjectRoute
    landing/             # Preview da landing
    brand/               # WalletLogo
  store/                 # projectStore, dashboardStore
  lib/                   # storage, compute, demo-data, format, themes, labels, utils
  styles/themes/         # CSS de cada tema curado
  types.ts               # Modelo de domínio
```

## Rotas

| Path | Página |
|------|--------|
| `/` | Landing |
| `/projetos` | Hub de projetos |
| `/project/:projectId` | Overview (index) |
| `…/accounts`, `…/transactions`, `…/budgets`, `…/reports`, `…/settings` | Dashboard |
| `/projects`, `/dashboard/*`, `/login`, `/register` | Redirects legados → `/projetos` ou `/` |

`ProjectRoute` inicializa o `projectStore`, carrega o projeto no `dashboardStore` e redireciona se o id for inválido.

## Princípios

1. **Cliente-only**: agregações e CRUD no browser; sem `fetch` para APIs próprias
2. **Projeto como unidade**: todo dado financeiro pertence a um `Project`
3. **Demo intocável na exclusão**: `isDemo` não pode ser deletado; use `resetDemoProject`
4. **i18n de UI**: textos em português; formatação via `src/lib/format.ts` (pt-BR / BRL)
5. **Preservar padrões existentes** ao estender features (dialogs, stores, labels)

## Comandos

```bash
npm run dev       # http://localhost:8080
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test
npm run ci        # lint + typecheck + test + build
VITE_BASE_PATH=/MyWallet/ npm run build   # simular Pages
```

CI: `.github/workflows/ci.yml` (PR / branches). Deploy Pages: `.github/workflows/deploy-pages.yml` (main) — só publica após os quality gates do CI.

## Ao estender o produto

- Nova página de dashboard → rota em `App.tsx` + item em `nav-items.ts` / `AppDock` + pasta em `components/dashboard/`
- Novo domínio de dados → tipo em `types.ts` + persistência no `Project` + ações no store adequado
- Não adicionar dependências pesadas sem necessidade clara no contexto de demo local
