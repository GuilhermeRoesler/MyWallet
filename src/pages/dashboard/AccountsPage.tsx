import { AccountList } from "@/components/dashboard/accounts/AccountList";
import { AccountSummaryStrip } from "@/components/dashboard/accounts/AccountSummaryStrip";

const AccountsPage = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Contas
        </h1>
        <p className="mt-1.5 text-sm text-foreground/70 md:text-base">
          Gerencie saldos e tipos de conta deste projeto.
        </p>
      </div>
      <AccountSummaryStrip />
      <AccountList />
    </div>
  );
};

export default AccountsPage;
