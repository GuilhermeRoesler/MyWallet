import { TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardPreviewProps = {
  /** `hero` = first fold; `immersive` = container scroll / full-bleed mock */
  variant?: "hero" | "immersive";
  className?: string;
};

/** Preview estático fidelizado do dashboard. */
export function DashboardPreview({
  variant = "hero",
  className,
}: DashboardPreviewProps) {
  const immersive = variant === "immersive";

  return (
    <div
      aria-hidden
      className={cn(
        "relative",
        immersive
          ? "h-full w-full"
          : "w-full max-w-lg animate-scale-in xl:max-w-xl",
        className
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
            : "rounded-2xl shadow-2xl shadow-foreground/12 ring-1 ring-foreground/5 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl"
        )}
      >
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/45" />
          <span className="ml-3 font-display text-xs font-medium text-muted-foreground">
            My Wallet · Visão geral
          </span>
        </div>

        <div
          className={cn(
            "grid grid-cols-[72px_1fr]",
            immersive && "md:grid-cols-[88px_1fr] h-[calc(100%-2.5rem)]"
          )}
        >
          <div className="space-y-2 bg-[hsl(170_28%_11%)] px-2.5 py-3">
            <div className="mx-auto mb-3 h-2 w-10 rounded-full bg-white/25" />
            {[1, 0.55, 0.55, 0.55, 0.4].map((op, i) => (
              <div
                key={i}
                className={cn("rounded-md", immersive ? "h-7" : "h-6")}
                style={{
                  background:
                    i === 0
                      ? "hsl(168 65% 36%)"
                      : `hsl(160 20% 96% / ${op * 0.12})`,
                }}
              />
            ))}
          </div>

          <div
            className={cn(
              "space-y-3 bg-gradient-to-b from-background to-muted/30 p-3.5 sm:p-4",
              immersive && "space-y-4 p-5 sm:p-6 md:p-7"
            )}
          >
            <div>
              <p
                className={cn(
                  "font-display font-semibold tracking-tight",
                  immersive ? "text-2xl md:text-3xl" : "text-lg sm:text-xl"
                )}
              >
                Olá, Alex
              </p>
              <p className="text-[11px] text-muted-foreground md:text-xs">
                Resumo da saúde financeira
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="rounded-xl border bg-card p-2.5 shadow-sm md:p-3.5">
                <div className="flex items-start justify-between">
                  <p className="text-[10px] text-muted-foreground">Saldo total</p>
                  <span className="rounded-md bg-primary/10 p-1">
                    <Wallet className="h-3 w-3 text-primary" />
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 font-display font-semibold tabular-nums",
                    immersive ? "text-xl md:text-2xl" : "text-base sm:text-lg"
                  )}
                >
                  R$&nbsp;51.100
                </p>
                <svg
                  viewBox="0 0 72 20"
                  className="mt-1.5 h-4 w-full text-primary opacity-80"
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    points="0,14 12,12 24,15 36,8 48,10 60,4 72,6"
                  />
                </svg>
              </div>
              <div className="rounded-xl border bg-card p-2.5 shadow-sm md:p-3.5">
                <div className="flex items-start justify-between">
                  <p className="text-[10px] text-muted-foreground">Fluxo líquido</p>
                  <span className="rounded-md bg-success/10 p-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 font-display font-semibold tabular-nums text-success",
                    immersive ? "text-xl md:text-2xl" : "text-base sm:text-lg"
                  )}
                >
                  +R$&nbsp;4.2k
                </p>
                <p className="mt-1 text-[10px] font-medium text-success">
                  Positivo no mês
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-2.5 shadow-sm md:p-3.5">
              <p className="mb-2 text-[10px] font-medium text-muted-foreground">
                Saldo ao longo do tempo
              </p>
              <svg
                viewBox="0 0 280 72"
                className={cn(
                  "w-full",
                  immersive ? "h-20 sm:h-24 md:h-28" : "h-16 sm:h-[4.5rem]"
                )}
              >
                <defs>
                  <linearGradient
                    id={immersive ? "previewFillImmersive" : "previewFillHero"}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(168 78% 24%)"
                      stopOpacity="0.28"
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(168 78% 24%)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0,52 C30,48 50,55 80,42 C110,28 130,38 160,30 C190,22 220,35 250,18 L280,22 L280,72 L0,72 Z"
                  fill={`url(#${immersive ? "previewFillImmersive" : "previewFillHero"})`}
                />
                <path
                  d="M0,52 C30,48 50,55 80,42 C110,28 130,38 160,30 C190,22 220,35 250,18 L280,22"
                  fill="none"
                  stroke="hsl(168 78% 24%)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-draw-line"
                />
              </svg>
            </div>

            <div className="rounded-xl border bg-card p-2.5 shadow-sm md:p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-medium text-muted-foreground">
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
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium tabular-nums">{row.pct}%</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
