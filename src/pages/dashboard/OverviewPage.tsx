import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  TrendingUp,
  Wallet,
  ArrowDownCircle,
} from "lucide-react";
import { RecentTransactionsCard } from "@/components/dashboard/overview/RecentTransactionsCard";
import { useDashboardStore } from "@/store/dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/dashboard/overview/KpiCard";
import { BalanceChart } from "@/components/dashboard/overview/BalanceChart";
import { formatChartDate, formatCurrency } from "@/lib/format";

const OverviewPage = () => {
  const { data: dashboardData, isLoading } = useDashboardStore();
  const overview = dashboardData?.overview;
  const currency = dashboardData?.project.settings.currency || "BRL";
  const ownerName = dashboardData?.user.name?.split(" ")[0] || "você";

  const balanceSeries =
    dashboardData?.balanceOverTime?.map((item) => item.balance) || [];

  const balanceChartData =
    dashboardData?.balanceOverTime?.map((item) => ({
      name: formatChartDate(item.date),
      saldo: item.balance,
    })) || [];

  const netFlow = overview
    ? overview.monthlyIncome - overview.monthlyExpense
    : 0;

  if (isLoading || !overview) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[380px] lg:col-span-2" />
          <Skeleton className="h-[380px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-rise">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Olá, {ownerName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumo da saúde financeira deste projeto.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          className="animate-rise"
          title="Saldo total"
          value={formatCurrency(overview.totalBalance, currency)}
          hint="Em todas as contas"
          icon={Wallet}
          tone="primary"
          sparkline={balanceSeries}
        />
        <KpiCard
          className="animate-rise-delay-1"
          title="Gastos do mês"
          value={formatCurrency(overview.monthlyExpense, currency)}
          hint="Despesas até agora"
          icon={CreditCard}
          tone="danger"
        />
        <KpiCard
          className="animate-rise-delay-2"
          title="Receitas do mês"
          value={formatCurrency(overview.monthlyIncome, currency)}
          hint="Entradas até agora"
          icon={ArrowDownCircle}
          tone="success"
        />
        <KpiCard
          className="animate-rise-delay-3"
          title="Fluxo líquido"
          value={formatCurrency(netFlow, currency)}
          hint="Receitas − despesas"
          icon={TrendingUp}
          tone={netFlow >= 0 ? "success" : "danger"}
          delta={netFlow >= 0 ? "Positivo no mês" : "Negativo no mês"}
          deltaPositive={netFlow >= 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/80 shadow-sm animate-rise-delay-1 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-xl font-semibold">
              Saldo ao longo do tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceChart data={balanceChartData} currency={currency} />
          </CardContent>
        </Card>
        <div className="animate-rise-delay-2">
          <RecentTransactionsCard />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
