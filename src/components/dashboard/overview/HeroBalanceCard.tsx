import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

type HeroBalanceCardProps = {
  balance: number;
  monthlyExpense: number;
  monthlyIncome: number;
  netFlow: number;
  currency: string;
  sparkline?: number[];
  className?: string;
};

function SparkArea({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 160;
  const h = 48;
  const coords = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return { x, y };
  });
  const line = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible opacity-90"
      aria-hidden
    >
      <polygon
        points={area}
        fill="hsl(var(--primary))"
        fillOpacity={0.12}
      />
      <polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={line}
      />
    </svg>
  );
}

export function HeroBalanceCard({
  balance,
  monthlyExpense,
  monthlyIncome,
  netFlow,
  currency,
  sparkline,
  className,
}: HeroBalanceCardProps) {
  const positive = netFlow >= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 shadow-sm md:p-7",
        "bg-gradient-to-br from-card via-card to-primary/[0.06]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-36 w-36 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            Saldo total
          </div>
          <p className="font-display text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">
            {formatCurrency(balance, currency)}
          </p>
          <p className="text-sm text-foreground/65">Em todas as contas ativas</p>
        </div>
        {sparkline && sparkline.length > 1 && <SparkArea values={sparkline} />}
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-background/70 px-3.5 py-3 backdrop-blur-sm">
          <p className="text-xs font-medium text-foreground/60">Gastos do mês</p>
          <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-destructive">
            {formatCurrency(monthlyExpense, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/70 px-3.5 py-3 backdrop-blur-sm">
          <p className="text-xs font-medium text-foreground/60">Receitas</p>
          <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-success">
            {formatCurrency(monthlyIncome, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/70 px-3.5 py-3 backdrop-blur-sm">
          <p className="flex items-center gap-1 text-xs font-medium text-foreground/60">
            Fluxo líquido
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
          </p>
          <p
            className={cn(
              "mt-0.5 font-display text-lg font-semibold tabular-nums",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {formatCurrency(netFlow, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
