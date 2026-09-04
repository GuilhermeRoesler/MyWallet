---
name: my-wallet-state
description: >-
  Modelo de dados, Zustand stores, localStorage e agregações do My Wallet.
  Use ao alterar types, projectStore, dashboardStore, storage, compute, demo-data ou format.
---

# My Wallet — Estado e dados

## Persistência

- Chave: `my-wallet:projects`
- API: `loadFromStorage` / `saveToStorage` / `createId` em `src/lib/storage.ts`
- Valor: array de `Project`
- JSON inválido → remove a chave e usa fallback (array vazio → seed demo no `init`)

## Modelo (`src/types.ts`)

```
Project
  id, name, description, createdAt, updatedAt, isDemo?
  settings: ProjectSettings   # ownerName, theme, currency, flags de notificação
  accounts: Account[]
  transactions: Transaction[]
  budgets: Omit<Budget, "spent">[]   # spent NÃO é persistido
```

- `Account`: id, name, type, balance, currency, status
- `Transaction`: id, account_id, date (`YYYY-MM-DD`), description, category, amount (>0), type `income` | `expense`
- `Budget` (view): category, allocated, **spent** (derivado)
- `DashboardData`: view montada por `buildDashboardView` (overview, reports, balanceOverTime, user espelhado das settings)

## Stores

### `useProjectStore` (`projectStore.ts`)

Responsável por lista de projetos:

- `init()` — carrega storage; se vazio, cria demo via `createDemoProject()`
- `createProject` / `updateProject` / `deleteProject` / `getProject` / `saveProject`
- `updateProjectSettings` — merge parcial em `settings`
- `resetDemoProject` — recria demo e substitui o antigo

Sempre persiste após mutação. Toasts via `@/utils/toast`.

### `useDashboardStore` (`dashboardStore.ts`)

Responsável pelo projeto **ativo**:

- `loadProject(id)` → `buildDashboardView(project)`
- `createItem` / `updateItem` / `deleteItem` com `CrudItemType`: `"account" | "transaction" | "budget"`
- Mutações escrevem no projeto via `projectStore.saveProject` e refrescam `data`
- Transações: ajustam `account.balance` com `applyAccountBalanceOnTransaction` (direction `1` create, `-1` delete; update = reverte + aplica)

## Agregações (`src/lib/compute.ts`)

| Função | Comportamento |
|--------|----------------|
| `computeBudgetSpent` | Soma expenses do mês atual por categoria |
| `computeOverview` | totalBalance + income/expense do mês |
| `computeReports` | spendingByCategory do mês |
| `computeBalanceOverTime` | série para gráfico |
| `buildDashboardView` | monta `DashboardData` completo |

**Datas:** use parse local (`parseLocalDate`) — nunca `new Date("YYYY-MM-DD")` (UTC desloca o dia).

## Seed e labels

- `src/lib/demo-data.ts` — `createDemoProject` / `createEmptyProject`
- `src/lib/labels.ts` — opções de categoria/tipo compartilhadas pelos forms
- `src/lib/format.ts` — `formatCurrency`, `formatDate`, `formatChartDate`, `signedCurrency` (pt-BR)

## Fluxo típico de CRUD

1. UI abre dialog → valida com Zod
2. Chama `useDashboardStore().createItem|updateItem|deleteItem`
3. Store altera o `Project` em memória + saldo se necessário
4. `saveProject` persiste no `projectStore` → localStorage
5. `data` é reconstruído com `buildDashboardView`

## Checklist ao mudar o modelo

- [ ] Atualizar `types.ts`
- [ ] Migrar/tolerar dados antigos no load se o shape mudou
- [ ] Ajustar `demo-data.ts`
- [ ] Ajustar `compute.ts` se a view depende do campo
- [ ] Ajustar forms Zod + dialogs
- [ ] Manter `spent` fora da persistência de budgets
