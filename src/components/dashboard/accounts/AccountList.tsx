import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Landmark,
  CreditCard,
  TrendingUp,
  PiggyBank,
  MoreVertical,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { AccountFormDialog } from "./AccountFormDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import type { Account } from "@/types";
import { formatCurrency } from "@/lib/format";
import { accountStatusLabel, accountTypeLabel } from "@/lib/labels";
import { EmptyState } from "@/components/ui/empty-state";

const accountIcons: { [key: string]: React.ElementType } = {
  Bank: Landmark,
  "Credit Card": CreditCard,
  Investment: TrendingUp,
  Savings: PiggyBank,
};

export function AccountList() {
  const { data, createItem, updateItem, deleteItem } = useDashboardStore();
  const accounts = data?.accounts || [];
  const defaultCurrency = data?.project.settings.currency || "BRL";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      if (selectedAccount) {
        await updateItem("account", { ...values, id: selectedAccount.id });
      } else {
        await createItem("account", values);
      }
      setIsFormOpen(false);
      setSelectedAccount(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedAccount) {
      setIsSubmitting(true);
      try {
        await deleteItem("account", selectedAccount.id);
        setIsDeleteConfirmOpen(false);
        setSelectedAccount(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const openCreateForm = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const openEditForm = (account: Account) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/65 sm:sr-only">
          {accounts.length} conta{accounts.length === 1 ? "" : "s"} neste workspace
        </p>
        <Button onClick={openCreateForm} className="w-full sm:ml-auto sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova conta
        </Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Nenhuma conta"
          description="Adicione uma conta bancária, cartão ou investimento para começar."
          actionLabel="Nova conta"
          onAction={openCreateForm}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account, index) => {
            const Icon = accountIcons[account.type] || Landmark;
            return (
              <Card
                key={account.id}
                className="flex flex-col border-border/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-rise"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-lg font-semibold">
                          {account.name}
                        </CardTitle>
                        <CardDescription>
                          {accountTypeLabel(account.type)}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditForm(account)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteConfirm(account)}
                          className="text-destructive"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col justify-end">
                  <div className="font-display text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                    {formatCurrency(
                      Number(account.balance),
                      account.currency || defaultCurrency,
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span
                      className={cn("h-2 w-2 rounded-full", {
                        "bg-success": account.status === "active",
                        "bg-muted-foreground/50": account.status === "inactive",
                        "bg-warning": account.status === "pending",
                      })}
                    />
                    <span className="text-foreground/65">
                      {accountStatusLabel(account.status)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AccountFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        accountToEdit={selectedAccount}
      />
      <DeleteAccountDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
      />
    </>
  );
}
