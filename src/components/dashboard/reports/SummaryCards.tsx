import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SummaryCards() {
  const { data: dashboardData } = useDashboardStore();
  const overview = dashboardData?.overview;
  const currency = dashboardData?.project.settings.currency || "BRL";

  const totalIncome = overview?.monthlyIncome || 0;
  const totalExpense = overview?.monthlyExpense || 0;
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border/80 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-success" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receita total
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="font-display text-2xl font-semibold tabular-nums text-success">
            {formatCurrency(totalIncome, currency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">No mês atual</p>
        </CardContent>
      </Card>
      <Card className="border-border/80 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-destructive" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Despesa total
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="font-display text-2xl font-semibold tabular-nums text-destructive">
            −{formatCurrency(totalExpense, currency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">No mês atual</p>
        </CardContent>
      </Card>
      <Card className="border-border/80 shadow-sm relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-0.5",
            netSavings >= 0 ? "bg-primary" : "bg-destructive",
          )}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Economia líquida
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "font-display text-2xl font-semibold tabular-nums",
              netSavings >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {formatCurrency(netSavings, currency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Receitas menos despesas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
