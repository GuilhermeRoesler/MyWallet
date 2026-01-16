import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";

export function SummaryCards() {
  const { data: dashboardData } = useDashboardStore();
  const overview = dashboardData?.overview;

  const totalIncome = overview?.monthlyIncome || 0;
  const totalExpense = overview?.monthlyExpense || 0;
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            For the current month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            -{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalExpense)}
          </div>
          <p className="text-xs text-muted-foreground">
            For the current month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(netSavings)}
          </div>
          <p className="text-xs text-muted-foreground">
            Income minus expenses
          </p>
        </CardContent>
      </Card>
    </div>
  );
}