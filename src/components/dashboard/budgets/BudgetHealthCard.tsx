import { AlertTriangle, CheckCircle2, PiggyBank } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

function Ring({
  ratio,
  overspent,
}: {
  ratio: number;
  overspent: boolean;
}) {
  const size = 112;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(ratio, 0), 1.15);
  const offset = c - clamped * c;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={
          overspent ? "hsl(var(--destructive))" : "hsl(var(--primary))"
        }
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
  );
}

export function BudgetHealthCard() {
  const { data } = useDashboardStore();
  const budgets = data?.budgets || [];
  const currency = data?.project.settings.currency || "BRL";

  if (budgets.length === 0) return null;

  const totalAllocated = budgets.reduce((s, b) => s + Number(b.allocated), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0);
  const ratio = totalAllocated > 0 ? totalSpent / totalAllocated : 0;
  const overspentCount = budgets.filter(
    (b) => Number(b.spent) > Number(b.allocated),
  ).length;
  const onTrackCount = budgets.length - overspentCount;
  const worst = [...budgets].sort(
    (a, b) =>
      Number(b.spent) / Math.max(Number(b.allocated), 1) -
      Number(a.spent) / Math.max(Number(a.allocated), 1),
  )[0];
  const worstRatio =
    Number(worst.allocated) > 0
      ? Number(worst.spent) / Number(worst.allocated)
      : 0;
  const overBudget = ratio > 1 || overspentCount > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm md:p-6">
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-primary/8 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <PiggyBank className="h-4 w-4" />
              </span>
              Saúde dos orçamentos
            </div>
            <p className="font-display text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
              {Math.round(ratio * 100)}%
              <span className="ml-2 text-base font-medium text-foreground/55">
                utilizado
              </span>
            </p>
            <p className="max-w-sm text-sm text-foreground/65">
              {formatCurrency(totalSpent, currency)} de{" "}
              {formatCurrency(totalAllocated, currency)} alocados neste mês.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {onTrackCount} no prazo
              </span>
              {overspentCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/12 px-2.5 py-1 text-xs font-medium text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {overspentCount} estourado{overspentCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="relative mx-auto flex h-28 w-28 items-center justify-center sm:mx-0">
            <Ring ratio={ratio} overspent={overBudget} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-lg font-semibold tabular-nums">
                {budgets.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-foreground/55">
                limites
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col justify-between rounded-2xl border p-5 shadow-sm md:p-6",
          worstRatio > 1
            ? "border-destructive/30 bg-destructive/[0.04]"
            : "border-border/80 bg-card",
        )}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/55">
            Atenção prioritária
          </p>
          <p className="mt-2 font-display text-xl font-semibold tracking-tight">
            {categoryLabel(worst.category)}
          </p>
          <p className="mt-1 text-sm text-foreground/65">
            {formatCurrency(Number(worst.spent), currency)} de{" "}
            {formatCurrency(Number(worst.allocated), currency)} ·{" "}
            <span
              className={cn(
                "font-medium tabular-nums",
                worstRatio > 1 ? "text-destructive" : "text-foreground",
              )}
            >
              {Math.round(worstRatio * 100)}%
            </span>
          </p>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                worstRatio > 1 ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${Math.min(worstRatio * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-foreground/60">
            {worstRatio > 1
              ? "Priorize reduzir gastos nesta categoria ou aumente o limite."
              : "Categoria com maior uso relativo neste mês."}
          </p>
        </div>
      </div>
    </div>
  );
}
