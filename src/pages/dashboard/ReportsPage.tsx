import { DateRangePicker } from "@/components/dashboard/reports/DateRangePicker";
import { ReportDataTable } from "@/components/dashboard/reports/ReportDataTable";
import { SpendingByCategoryChart } from "@/components/dashboard/reports/SpendingByCategoryChart";
import { SummaryCards } from "@/components/dashboard/reports/SummaryCards";

const ReportsPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-lg text-muted-foreground">
            Analyze your income and spending patterns.
          </p>
        </div>
        <DateRangePicker />
      </div>
      <SummaryCards />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SpendingByCategoryChart />
        </div>
        <div className="lg:col-span-2">
          <ReportDataTable />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;