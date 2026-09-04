import { useMemo, useState } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/dashboard/reports/DateRangePicker";
import { ReportDataTable } from "@/components/dashboard/reports/ReportDataTable";
import { SpendingByCategoryChart } from "@/components/dashboard/reports/SpendingByCategoryChart";
import { SummaryCards } from "@/components/dashboard/reports/SummaryCards";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  computePeriodTotals,
  computeReports,
  filterTransactionsByRange,
} from "@/lib/compute";

const ReportsPage = () => {
  const { data } = useDashboardStore();
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = addDays(to, -30);
    return { from, to };
  });

  const range =
    date?.from && date?.to ? { from: date.from, to: date.to } : undefined;

  const fromMs = range?.from.getTime();
  const toMs = range?.to.getTime();

  const filteredTransactions = useMemo(
    () => filterTransactionsByRange(data?.transactions ?? [], range),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- range keyed by timestamps
    [data?.transactions, fromMs, toMs],
  );

  const reports = useMemo(
    () => computeReports(data?.transactions ?? [], range),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.transactions, fromMs, toMs],
  );

  const totals = useMemo(
    () => computePeriodTotals(filteredTransactions),
    [filteredTransactions],
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Relatórios
          </h1>
          <p className="mt-1 text-muted-foreground">
            Analise padrões de receita e despesa.
          </p>
        </div>
        <DateRangePicker date={date} onDateChange={setDate} />
      </div>
      <SummaryCards
        income={totals.income}
        expense={totals.expense}
        periodLabel="No período selecionado"
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SpendingByCategoryChart
            spendingByCategory={reports.spendingByCategory}
          />
        </div>
        <div className="lg:col-span-3">
          <ReportDataTable transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
