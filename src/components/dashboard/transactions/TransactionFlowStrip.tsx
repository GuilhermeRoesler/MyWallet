import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

function isCurrentMonth(dateStr: string) {
  const now = new Date();
  const [y, m] = dateStr.slice(0, 10).split("-").map(Number);
  return y === now.getFullYear() && m === now.getMonth() + 1;
}

export function TransactionFlowStrip() {
  const { data } = useDashboardStore();
  const transactions = data?.transactions || [];
  const currency = data?.project.settings.currency || "BRL";
  const overview = data?.overview;

  if (transactions.length === 0) return null;

  const monthTx = transactions.filter((t) => isCurrentMonth(t.date));
  const income = overview?.monthlyIncome ?? 0;
  const expense = overview?.monthlyExpense ?? 0;
  const net = income - expense;
  const max = Math.max(income, expense, 1);
  const positive = net >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -left-6 top-0 h-28 w-28 rounded-full bg-success/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-destructive/10 blur-2xl" />

      <div className="relative grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Receipt className="h-4 w-4" />
            </span>
            Fluxo do mês
          </div>

          <div className="space-y-2.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-success">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Entradas
                </span>
                <span className="font-medium tabular-nums text-success">
                  {formatCurrency(income, currency)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${(income / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-destructive">
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  Saídas
                </span>
                <span className="font-medium tabular-nums text-destructive">
                  {formatCurrency(expense, currency)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-destructive transition-all duration-500"
                  style={{ width: `${(expense / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-center sm:min-w-[9.5rem]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/55">
            Líquido
          </p>
          <p
            className={cn(
              "mt-1 font-display text-2xl font-semibold tabular-nums",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {formatCurrency(net, currency)}
          </p>
          <p className="mt-1 text-xs text-foreground/60">
            {monthTx.length} movimentações
          </p>
        </div>
      </div>
    </div>
  );
}
