---
name: my-wallet-ui
description: >-
  Padrões de UI, Shadcn, formulários e páginas do My Wallet.
  Use ao criar/editar components, pages, dialogs, layout ou landing.
---

# My Wallet — UI e componentes

## Hierarquia

| Camada | Onde | Papel |
|--------|------|--------|
| Primitivos | `components/ui/*` | Shadcn (não reinventar) |
| Layout | `components/layout/*` | Shell do dashboard, nav, command palette |
| Feature | `components/dashboard/<domínio>/*` | Listas, forms, charts, settings |
| Projetos | `components/projects/*` | Hub CRUD + `ProjectRoute` |
| Pages | `pages/*` | Composição fina; lógica pesada nos stores/components |

Config Shadcn: `components.json` (style default, CSS variables, alias `@/components`).

## Convenções de código

- Functional components + TypeScript
- Classes: Tailwind + `cn()` de `@/lib/utils`
- Ícones: `lucide-react`
- Tipografia de marca: classe `font-display` (Fraunces em `globals.css`)
- Números monetários: `tabular-nums` + `formatCurrency` / `signedCurrency`
- Empty states: `components/ui/empty-state.tsx` quando fizer sentido

## Formulários

Padrão obrigatório:

1. Schema Zod (mensagens de erro em PT)
2. `useForm` + `zodResolver`
3. UI com `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
4. Dialogs controlados por `isOpen` / `onClose` / `onSubmit` / `isLoading`
5. Delete: `AlertDialog` dedicado (`Delete*Dialog`)

Exemplos de referência:

- `TransactionFormDialog.tsx`
- `AccountFormDialog.tsx`
- `BudgetFormDialog.tsx`
- `ProjectFormDialog.tsx`

Categorias/tipos: importar de `@/lib/labels`, não hardcodar listas divergentes.

## Feedback

```ts
import { showSuccess, showError } from "@/utils/toast";
```

Preferir toasts nos stores para mutações compartilhadas; na UI só quando for ação puramente local.

## Dashboard

- Dados: `useDashboardStore()` → `data`
- Loading/erro de rota: tratado em `ProjectRoute`
- Listas + dialogs de create/edit/delete por domínio
- Charts: Recharts; cores via tokens `--chart-*` / CSS variables do tema
- Overview: KPIs (`KpiCard`), `BalanceChart`, `RecentTransactionsCard`

## Landing (`LandingPage.tsx`)

- Brand-first: “My Wallet” como sinal hero (não só nav)
- Uma composição no primeiro viewport: brand, headline, suporte, CTAs, preview
- Atmosfera: `mesh-hero` / utilities em `globals.css`
- CTAs: explorar demo (`resetDemoProject` + navigate) e ir a `/projetos`
- Não transformar a landing em dashboard cheio de cards/stats no hero

## Layout do dashboard

- `DashboardLayout` + `SidebarNav` + `Navbar` / `UserNav`
- Rotas filhas via `<Outlet />`
- Manter navegação alinhada com paths em `App.tsx`

## Checklist de novo feature UI

- [ ] Página em `pages/dashboard/` (se rota nova)
- [ ] Componentes em `components/dashboard/<domínio>/`
- [ ] Primitivos Shadcn reutilizados
- [ ] Validação Zod + Form*
- [ ] Toasts / empty state
- [ ] Textos em português
- [ ] Responsivo (mobile: ver `use-mobile` se já usado no layout)
