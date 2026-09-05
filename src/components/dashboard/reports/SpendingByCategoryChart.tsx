import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { EmptyState } from "@/components/ui/empty-state";
import { PieChartIcon } from "lucide-react";
import type { SpendingByCategory } from "@/types";
import { cn } from "@/lib/utils";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--muted-foreground))",
];

const CHART_EXCLUDED = new Set(["Savings", "Income"]);

type SpendingByCategoryChartProps = {
  spendingByCategory?: SpendingByCategory[];
};

export function SpendingByCategoryChart({
  spendingByCategory,
}: SpendingByCategoryChartProps) {
  const { data: dashboardData } = useDashboardStore();
  const currency = dashboardData?.project.settings.currency || "BRL";
  const source =
    spendingByCategory ?? dashboardData?.reports.spendingByCategory ?? [];

  const chartData = source
    .filter((item) => !CHART_EXCLUDED.has(item.category))
    .map((item) => ({
      name: categoryLabel(item.category),
      value: Math.abs(Number(item.total)),
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="border-border/80 shadow-sm h-full animate-rise">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl font-semibold">
          Gastos por categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="flex flex-col gap-5">
            <div className="relative mx-auto h-[200px] w-full max-w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={2.5}
                    dataKey="value"
                    nameKey="name"
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                    isAnimationActive
                    animationDuration={900}
                    animationBegin={80}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.75rem",
                      boxShadow: "0 8px 24px hsl(var(--foreground) / 0.08)",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value, currency),
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] font-medium uppercase tracking-wide text-foreground/55">
                  Total
                </p>
                <p className="font-display text-sm font-semibold tabular-nums">
                  {formatCurrency(total, currency)}
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {chartData.map((item, index) => {
                const pct = total > 0 ? (item.value / total) * 100 : 0;
                return (
                  <li key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            background: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="truncate font-medium text-foreground">
                          {item.name}
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums text-foreground">
                        {formatCurrency(item.value, currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all")}
                          style={{
                            width: `${Math.max(pct, 2)}%`,
                            background: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-foreground/55">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <EmptyState
            icon={PieChartIcon}
            title="Sem dados de gasto"
            description="Não há despesas neste período para exibir."
            className="h-full border-0 bg-transparent py-8"
          />
        )}
      </CardContent>
    </Card>
  );
}
