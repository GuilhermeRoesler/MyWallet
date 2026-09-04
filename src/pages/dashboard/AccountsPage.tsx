import { AccountList } from "@/components/dashboard/accounts/AccountList";

const AccountsPage = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Contas</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie saldos e tipos de conta deste projeto.
        </p>
      </div>
      <AccountList />
    </div>
  );
};

export default AccountsPage;
