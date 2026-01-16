import { BudgetList } from "@/components/dashboard/budgets/BudgetList";

const BudgetsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Budgets</h1>
      <p className="text-lg text-muted-foreground">Set and track your spending budgets.</p>
      <BudgetList />
    </div>
  );
};

export default BudgetsPage;