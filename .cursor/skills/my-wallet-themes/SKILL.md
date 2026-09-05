---
name: my-wallet-themes
description: >-
  Sistema de temas curados do My Wallet (CSS variables + next-themes + registry).
  Use ao adicionar, remover ou ajustar temas, swatches ou ThemeSwitcher.
---

# My Wallet — Temas

## Temas oficiais (produto)

Fonte da verdade: `src/lib/themes.ts`.

| Nome UI | `value` (classe) | Arquivo CSS |
|---------|------------------|---------------|
| Atelier | `light` | `styles/themes/light.css` |
| Noite | `dark` | `styles/themes/dark.css` |
| Menta | `mint` | `styles/themes/mint.css` |
| Crepúsculo | `twilight` | `styles/themes/twilight.css` |
| Âmbar | `golden-elegancy` | `styles/themes/golden-elegancy.css` |
| Mono | `mono` | `styles/themes/mono.css` |

`themeValues` alimenta `ThemeProvider` em `App.tsx`. O seletor visual usa `swatch` (background / primary / accent).

> Podem existir CSS extras em `styles/themes/` que **não** estão no registry. Não os exponha na UI sem adicionar entrada em `themes.ts` e import em `globals.css`.

## Como os temas aplicam

1. `ThemeProvider` (`next-themes`) com `attribute="class"`, `enableSystem={false}`, `themes={themeValues}`
2. Classe no elemento raiz (ex.: `class="mint"`) ativa o bloco CSS correspondente
3. Preferência salva em `project.settings.theme` (via settings / `AppearanceForm` / `ThemeSwitcher`)
4. Tokens consumidos pelo Tailwind/Shadcn: `bg-background`, `text-primary`, `border-border`, etc.

## Tokens obrigatórios por tema

Cada arquivo deve definir (formato HSL **sem** `hsl()`, como no shadcn), no seletor do tema:

- Superfícies: `--background`, `--foreground`, `--card`, `--popover`, `--muted`, `--accent`, `--secondary`
- Marca: `--primary`, `--primary-foreground`
- Estado: `--destructive`, `--success`, `--warning` (+ foregrounds)
- Chrome: `--border`, `--input`, `--ring`, `--radius`
- Sidebar: `--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- Charts: `--chart-1` … `--chart-5`

Referência: `src/styles/themes/light.css`.

## Adicionar um tema

1. Criar `src/styles/themes/<slug>.css` com todos os tokens
2. `@import` em `src/globals.css`
3. Entrada em `themes` em `src/lib/themes.ts` (`name`, `value` = slug/classe, `swatch`)
4. Verificar `ThemeSwitcher` / `AppearanceForm` (devem iterar `themes` automaticamente)
5. Testar overview, sidebar/dock, charts e forms no tema novo

## Remover ou renomear

- Atualizar `themes.ts`, import CSS e default (`App` usa `defaultTheme="light"`)
- Migrar projetos com `settings.theme` antigo (fallback para `light` no load/apply)

## Direção visual

- Identidade atual: teal/atelier como base; variações curadas (menta, crepúsculo, âmbar, mono, noite)
- Evitar cascata genérica “AI purple-on-white” se for adicionar tema novo
- Landing usa atmosfera (`mesh-hero`, gradientes) alinhada aos tokens `--primary` / `--background`
- Display: Fraunces (`.font-display`); corpo antialiased com feature settings em `globals.css`

## Checklist

- [ ] CSS completo de tokens
- [ ] Import em `globals.css`
- [ ] Registry + swatch em `themes.ts`
- [ ] Classe/`value` consistentes
- [ ] Sem tema “fantasma” só no disco sem registry (ou documentar como experimental)
