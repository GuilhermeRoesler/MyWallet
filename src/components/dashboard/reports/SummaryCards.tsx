import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type SummaryCardsProps = {
  income: number;
  expense: number;
  periodLabel?: string;
};

export function SummaryCards({
  income,
  expense,
  periodLabel = "No período selecionado",
}: SummaryCardsProps) {
  const { data: dashboardData } = useDashboardStore();
  const currency = dashboardData?.project.settings.currency || "BRL";
  const netSavings = income - expense;
  const positive = netSavings >= 0;
  const max = Math.max(income, expense, 1);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.06] p-5 shadow-sm sm:p-6 animate-rise">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            Economia líquida
          </div>
          <p
            className={cn(
              "font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl md:text-5xl",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {formatCurrency(netSavings, currency)}
          </p>
          <p className="text-sm text-foreground/65">{periodLabel}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/70 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-foreground/60">Receitas</p>
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            </div>
            <p className="mt-1 font-display text-xl font-semibold tabular-nums text-success">
              {formatCurrency(income, currency)}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${(income / max) * 100}%` }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-foreground/60">Despesas</p>
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            </div>
            <p className="mt-1 font-display text-xl font-semibold tabular-nums text-destructive">
              {formatCurrency(expense, currency)}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-destructive"
                style={{ width: `${(expense / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
