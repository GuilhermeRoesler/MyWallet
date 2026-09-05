import { TransactionList } from "@/components/dashboard/transactions/TransactionList";
import { TransactionFlowStrip } from "@/components/dashboard/transactions/TransactionFlowStrip";

const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Transações
        </h1>
        <p className="mt-1.5 text-sm text-foreground/70 md:text-base">
          Veja e categorize todas as movimentações.
        </p>
      </div>
      <TransactionFlowStrip />
      <TransactionList />
    </div>
  );
};

export default TransactionsPage;
