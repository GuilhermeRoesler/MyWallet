import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";

type BalanceChartProps = {
  data: { name: string; saldo: number }[];
  currency?: string;
};

export function BalanceChart({ data, currency = "BRL" }: BalanceChartProps) {
  return (
    <div className="h-[220px] w-full animate-rise-delay-1 sm:h-[280px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", {
                notation: "compact",
                compactDisplay: "short",
              }).format(v)
            }
            width={48}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.75rem",
              boxShadow: "0 8px 24px hsl(var(--foreground) / 0.08)",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value: number) => [formatCurrency(value, currency), "Saldo"]}
          />
          <Area
            type="monotone"
            dataKey="saldo"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            fill="url(#balanceFill)"
            isAnimationActive
            animationDuration={1200}
            animationBegin={100}
            animationEasing="ease-out"
            activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
