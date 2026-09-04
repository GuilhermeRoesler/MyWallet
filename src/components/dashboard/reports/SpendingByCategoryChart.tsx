import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { EmptyState } from "@/components/ui/empty-state";
import { PieChartIcon } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--muted-foreground))",
];

/** Categorias de transferência/aporte que poluem o gráfico de gastos. */
const CHART_EXCLUDED = new Set(["Savings", "Income"]);

export function SpendingByCategoryChart() {
  const { data: dashboardData } = useDashboardStore();
  const currency = dashboardData?.project.settings.currency || "BRL";

  const chartData =
    dashboardData?.reports.spendingByCategory
      .filter((item) => !CHART_EXCLUDED.has(item.category))
      .map((item) => ({
        name: categoryLabel(item.category),
        value: Math.abs(Number(item.total)),
      }))
      .sort((a, b) => b.value - a.value) || [];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="border-border/80 shadow-sm h-full animate-rise">
      <CardHeader>
        <CardTitle className="font-display text-xl font-semibold">
          Gastos por categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="46%"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={3}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={800}
                  animationBegin={120}
                  label={({ name, percent }) =>
                    percent >= 0.08
                      ? `${name} ${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                  labelLine={false}
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
                <Legend
                  verticalAlign="bottom"
                  height={48}
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => {
                    const item = chartData.find((d) => d.name === value);
                    const pct =
                      item && total > 0
                        ? ` · ${((item.value / total) * 100).toFixed(0)}%`
                        : "";
                    return (
                      <span className="text-muted-foreground">
                        {value}
                        {pct}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={PieChartIcon}
              title="Sem dados de gasto"
              description="Não há despesas neste período para exibir."
              className="h-full border-0 bg-transparent py-8"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
