import { BudgetList } from "@/components/dashboard/budgets/BudgetList";

const BudgetsPage = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Orçamentos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Defina limites e acompanhe o gasto por categoria.
        </p>
      </div>
      <BudgetList />
    </div>
  );
};

export default BudgetsPage;
