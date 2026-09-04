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

export function SpendingByCategoryChart() {
  const { data: dashboardData } = useDashboardStore();
  const currency = dashboardData?.project.settings.currency || "BRL";

  const chartData =
    dashboardData?.reports.spendingByCategory.map((item) => ({
      name: categoryLabel(item.category),
      value: Math.abs(Number(item.total)),
    })) || [];

  return (
    <Card className="border-border/80 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="font-display text-xl font-semibold">
          Gastos por categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
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
                  }}
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => (
                    <span className="text-muted-foreground">{value}</span>
                  )}
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
