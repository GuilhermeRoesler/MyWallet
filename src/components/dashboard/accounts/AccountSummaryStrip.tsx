import { Landmark, Wallet } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { accountTypeLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

const TYPE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function AccountSummaryStrip() {
  const { data } = useDashboardStore();
  const accounts = data?.accounts || [];
  const currency = data?.project.settings.currency || "BRL";

  if (accounts.length === 0) return null;

  const total = accounts.reduce((s, a) => s + Number(a.balance), 0);
  const active = accounts.filter((a) => a.status === "active").length;

  const byType = accounts.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + Math.abs(Number(a.balance));
    return acc;
  }, {});
  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  const typeTotal = typeEntries.reduce((s, [, v]) => s + v, 0) || 1;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.06] p-5 shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            Portfólio de contas
          </div>
          <p className="font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
            {formatCurrency(total, currency)}
          </p>
          <p className="text-sm text-foreground/65">
            {active} ativas · {accounts.length} no total
          </p>
        </div>

        <div className="min-w-0 flex-1 sm:max-w-xs">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <Landmark className="h-3.5 w-3.5" />
            Composição por tipo
          </p>
          <div className="mb-2 flex h-2.5 overflow-hidden rounded-full bg-muted">
            {typeEntries.map(([type, value], i) => (
              <div
                key={type}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${(value / typeTotal) * 100}%`,
                  background: TYPE_COLORS[i % TYPE_COLORS.length],
                }}
                title={accountTypeLabel(type)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {typeEntries.map(([type, value], i) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 text-[11px] text-foreground/70"
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full")}
                  style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }}
                />
                {accountTypeLabel(type)}
                <span className="tabular-nums text-foreground/50">
                  {Math.round((value / typeTotal) * 100)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
