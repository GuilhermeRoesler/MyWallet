import { TransactionList } from "@/components/dashboard/transactions/TransactionList";

const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Transações
        </h1>
        <p className="mt-1 text-muted-foreground">
          Veja e categorize todas as movimentações.
        </p>
      </div>
      <TransactionList />
    </div>
  );
};

export default TransactionsPage;
