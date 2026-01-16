import { AccountList } from "@/components/dashboard/accounts/AccountList";

const AccountsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Accounts</h1>
      <p className="text-lg text-muted-foreground">Manage your financial accounts here.</p>
      <AccountList />
    </div>
  );
};

export default AccountsPage;