import { BudgetList } from "@/components/dashboard/budgets/BudgetList";
import { BudgetHealthCard } from "@/components/dashboard/budgets/BudgetHealthCard";

const BudgetsPage = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Orçamentos
        </h1>
        <p className="mt-1.5 text-sm text-foreground/70 md:text-base">
          Defina limites e acompanhe o gasto por categoria.
        </p>
      </div>
      <BudgetHealthCard />
      <BudgetList />
    </div>
  );
};

export default BudgetsPage;
