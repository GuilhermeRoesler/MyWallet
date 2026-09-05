import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentTransactionsCard } from "@/components/dashboard/overview/RecentTransactionsCard";
import { InsightBanner } from "@/components/dashboard/overview/InsightBanner";
import { useDashboardStore } from "@/store/dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { BalanceChart } from "@/components/dashboard/overview/BalanceChart";
import { HeroBalanceCard } from "@/components/dashboard/overview/HeroBalanceCard";
import { formatChartDate } from "@/lib/format";

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
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-80" />
        </div>
        <div className="grid gap-4 md:grid-cols-[1.35fr_0.9fr]">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-[280px] sm:h-[340px] md:col-span-2" />
          <Skeleton className="h-[280px] sm:h-[340px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      <div className="animate-rise">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Olá, {ownerName}
        </h1>
        <p className="mt-1.5 text-sm text-foreground/70 md:text-base">
          Resumo da saúde financeira deste projeto.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.35fr_0.9fr] md:items-stretch">
        <HeroBalanceCard
          className="animate-rise"
          balance={overview.totalBalance}
          monthlyExpense={overview.monthlyExpense}
          monthlyIncome={overview.monthlyIncome}
          netFlow={netFlow}
          currency={currency}
          sparkline={balanceSeries}
        />
        <InsightBanner stacked />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <Card className="overflow-hidden border-border/80 shadow-sm animate-rise-delay-1 md:col-span-2">
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
