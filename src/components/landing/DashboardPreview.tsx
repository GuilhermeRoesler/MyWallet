import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  ListChecks,
  PiggyBank,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardPreviewProps = {
  /** `hero` = first fold; `immersive` = container scroll / full-bleed mock */
  variant?: "hero" | "immersive";
  className?: string;
};

const DOCK_ICONS = [
  LayoutDashboard,
  Wallet,
  ListChecks,
  PiggyBank,
  BarChart3,
  Settings,
] as const;

/** Preview estático fidelizado do dashboard (shell com dock inferior). */
export function DashboardPreview({
  variant = "hero",
  className,
}: DashboardPreviewProps) {
  const immersive = variant === "immersive";
  const fillId = immersive ? "previewFillImmersive" : "previewFillHero";

  return (
    <div
      aria-hidden
      className={cn(
        "relative",
        immersive
          ? "h-full w-full"
          : "w-full max-w-lg animate-scale-in xl:max-w-xl",
        className,
      )}
    >
      {!immersive && (
        <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl animate-pulse-soft" />
      )}
      <div
        className={cn(
          "relative overflow-hidden border border-border/70 bg-card",
          immersive
            ? "h-full rounded-none shadow-none ring-0"
            : "rounded-2xl shadow-2xl shadow-foreground/12 ring-1 ring-foreground/5 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border/60 bg-background/80 px-4 py-2.5 backdrop-blur-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/45" />
          <span className="ml-3 font-display text-xs font-medium text-foreground/65">
            My Wallet · Visão geral
          </span>
        </div>

        <div
          className={cn(
            "relative bg-gradient-to-b from-background to-muted/30",
            immersive && "flex h-[calc(100%-2.5rem)] flex-col",
          )}
        >
          <div
            className={cn(
              "space-y-3 p-3.5 sm:p-4",
              immersive && "flex-1 space-y-4 overflow-hidden p-5 sm:p-6 md:p-7",
            )}
          >
            <div>
              <p
                className={cn(
                  "font-display font-semibold tracking-tight",
                  immersive ? "text-2xl md:text-3xl" : "text-lg sm:text-xl",
                )}
              >
                Olá, Alex
              </p>
              <p className="text-[11px] text-foreground/65 md:text-xs">
                Resumo da saúde financeira
              </p>
            </div>

            {/* Bento: herói + insight — espelha OverviewPage */}
            <div
              className={cn(
                "grid gap-2.5",
                immersive && "sm:grid-cols-[1.35fr_0.9fr] sm:items-stretch",
              )}
            >
              <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.06] p-3 shadow-sm md:p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-foreground/65">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Wallet className="h-3 w-3" />
                      </span>
                      Saldo total
                    </div>
                    <p
                      className={cn(
                        "font-display font-semibold tabular-nums tracking-tight",
                        immersive
                          ? "text-2xl md:text-3xl"
                          : "text-xl sm:text-2xl",
                      )}
                    >
                      R$&nbsp;51.100
                    </p>
                  </div>
                  <svg
                    viewBox="0 0 72 28"
                    className="mt-1 h-7 w-16 shrink-0 text-primary opacity-85 sm:h-8 sm:w-20"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,18 8,20 16,14 24,16 34,10 44,12 52,6 62,8 72,4"
                    />
                  </svg>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg border border-border/70 bg-background/70 px-1.5 py-1.5">
                    <p className="text-[9px] text-foreground/55">Gastos</p>
                    <p className="font-display text-[11px] font-semibold tabular-nums text-destructive sm:text-xs">
                      R$&nbsp;5.3k
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/70 px-1.5 py-1.5">
                    <p className="text-[9px] text-foreground/55">Receitas</p>
                    <p className="font-display text-[11px] font-semibold tabular-nums text-success sm:text-xs">
                      R$&nbsp;9.7k
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/70 px-1.5 py-1.5">
                    <p className="flex items-center gap-0.5 text-[9px] text-foreground/55">
                      Fluxo
                      <TrendingUp className="h-2.5 w-2.5 text-success" />
                    </p>
                    <p className="font-display text-[11px] font-semibold tabular-nums text-success sm:text-xs">
                      +R$&nbsp;4.2k
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "flex flex-col gap-2",
                  !immersive && "sm:flex-row",
                )}
              >
                <div className="flex flex-1 items-start gap-2 rounded-xl border border-destructive/25 bg-card p-2.5 shadow-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium leading-snug">
                      Restaurantes em 122%
                    </p>
                    <p className="mt-0.5 text-[10px] text-foreground/60">
                      R$ 488 de R$ 400 neste mês.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 items-start gap-2 rounded-xl border border-success/25 bg-card p-2.5 shadow-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium leading-snug">
                      Fluxo +R$ 4.2k
                    </p>
                    <p className="mt-0.5 text-[10px] text-foreground/60">
                      Receitas acima das despesas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-2.5 shadow-sm md:p-3.5">
              <p className="mb-2 text-[10px] font-medium text-foreground/65">
                Saldo ao longo do tempo
              </p>
              <svg
                viewBox="0 0 280 72"
                className={cn(
                  "w-full",
                  immersive ? "h-20 sm:h-24 md:h-28" : "h-14 sm:h-16",
                )}
              >
                <defs>
                  <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity="0.28"
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0,52 C20,48 35,56 55,40 C75,26 95,44 120,32 C140,22 155,38 175,18 C195,8 220,28 245,12 L280,16 L280,72 L0,72 Z"
                  fill={`url(#${fillId})`}
                />
                <path
                  d="M0,52 C20,48 35,56 55,40 C75,26 95,44 120,32 C140,22 155,38 175,18 C195,8 220,28 245,12 L280,16"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-draw-line"
                />
              </svg>
            </div>

            {immersive && (
              <div className="rounded-xl border bg-card p-2.5 shadow-sm md:p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-medium text-foreground/65">
                    Orçamentos
                  </p>
                  <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-medium text-destructive">
                    1 estourado
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Moradia", pct: 88, tone: "bg-primary" },
                    { label: "Restaurantes", pct: 100, tone: "bg-destructive" },
                    { label: "Alimentação", pct: 91, tone: "bg-primary" },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-foreground/60">{row.label}</span>
                        <span className="font-medium tabular-nums">
                          {row.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${row.tone} animate-bar-fill`}
                          style={{ width: `${Math.min(row.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className={cn(
              "pointer-events-none flex justify-center px-3 pb-3 pt-1",
              immersive && "mt-auto",
            )}
          >
            <div className="flex items-end gap-1 rounded-2xl border border-border/70 bg-background/85 px-2 py-1.5 shadow-md ring-1 ring-foreground/5 backdrop-blur-md sm:gap-1.5 sm:px-2.5 sm:py-2">
              {DOCK_ICONS.map((Icon, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex items-center justify-center rounded-lg border",
                    immersive
                      ? "h-7 w-7 sm:h-8 sm:w-8"
                      : "h-6 w-6 sm:h-7 sm:w-7",
                    i === 0
                      ? "border-primary/35 bg-primary text-primary-foreground"
                      : "border-transparent bg-muted/70 text-muted-foreground",
                  )}
                >
                  <Icon
                    className={immersive ? "h-3.5 w-3.5" : "h-3 w-3"}
                    strokeWidth={2.1}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
