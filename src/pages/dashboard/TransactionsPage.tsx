import { TransactionList } from "@/components/dashboard/transactions/TransactionList";

const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <p className="text-lg text-muted-foreground">View and categorize your transactions.</p>
      <TransactionList />
    </div>
  );
};

export default TransactionsPage;