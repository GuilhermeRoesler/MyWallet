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
import { Landmark, CreditCard, TrendingUp, PiggyBank, MoreVertical, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { AccountFormDialog } from "./AccountFormDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import type { Account } from "@/types";

const accountIcons: { [key: string]: React.ElementType } = {
  Bank: Landmark,
  "Credit Card": CreditCard,
  Investment: TrendingUp,
  Savings: PiggyBank,
};

export function AccountList() {
  const { data, createItem, updateItem, deleteItem } = useDashboardStore();
  const accounts = data?.accounts || [];

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
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = accountIcons[account.type] || Landmark;
          return (
            <Card key={account.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{account.name}</CardTitle>
                      <CardDescription>{account.type}</CardDescription>
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
                      <DropdownMenuItem onClick={() => openDeleteConfirm(account)} className="text-red-500">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: account.currency || "USD",
                  }).format(Number(account.balance))}
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span
                    className={cn("h-2 w-2 rounded-full", {
                      "bg-green-500": account.status === "active",
                      "bg-gray-400": account.status === "inactive",
                      "bg-yellow-500": account.status === "pending",
                    })}
                  />
                  <span className="capitalize text-muted-foreground">{account.status}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
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