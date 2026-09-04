import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Utensils,
  Home,
  Coffee,
  ArrowDownCircle,
  Car,
  ShoppingCart,
  Film,
  FileText,
  MoreVertical,
  PlusCircle,
  HeartPulse,
  PiggyBank,
  Receipt,
} from "lucide-react";
import { Button } from "../../ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { TransactionFormDialog } from "./TransactionFormDialog";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const categoryIcons: { [key: string]: React.ElementType } = {
  Food: Utensils,
  "Food & Groceries": Utensils,
  Income: ArrowDownCircle,
  Dining: Coffee,
  Housing: Home,
  Transportation: Car,
  Entertainment: Film,
  Utilities: FileText,
  Shopping: ShoppingCart,
  Health: HeartPulse,
  Savings: PiggyBank,
};

export function TransactionList() {
  const { data, createItem, updateItem, deleteItem } = useDashboardStore();
  const transactions = data?.transactions || [];
  const accounts = data?.accounts || [];
  const currency = data?.project.settings.currency || "BRL";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      if (selectedTransaction) {
        await updateItem("transaction", {
          ...values,
          id: selectedTransaction.id,
        });
      } else {
        await createItem("transaction", values);
      }
      setIsFormOpen(false);
      setSelectedTransaction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedTransaction) {
      setIsSubmitting(true);
      try {
        await deleteItem("transaction", selectedTransaction.id);
        setIsDeleteConfirmOpen(false);
        setSelectedTransaction(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const openCreateForm = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const openEditForm = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-xl font-semibold">
              Todas as transações
            </CardTitle>
            <CardDescription>
              Lista detalhada das movimentações financeiras.
            </CardDescription>
          </div>
          <Button onClick={openCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nova transação
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Nenhuma transação"
              description="Registre receitas e despesas para acompanhar o fluxo."
              actionLabel="Nova transação"
              onAction={openCreateForm}
              className="border-0 bg-transparent"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const Icon = categoryIcons[transaction.category] || Utensils;
                  const account = accounts.find(
                    (acc) => acc.id === transaction.account_id,
                  );
                  return (
                    <TableRow key={transaction.id} className="group">
                      <TableCell className="text-muted-foreground tabular-nums">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "rounded-full p-2",
                              transaction.type === "income"
                                ? "bg-success/10"
                                : "bg-secondary",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4",
                                transaction.type === "income"
                                  ? "text-success"
                                  : "text-muted-foreground",
                              )}
                            />
                          </div>
                          <span>{transaction.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>{account?.name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabel(transaction.category)}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold tabular-nums",
                          transaction.type === "income"
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {transaction.type === "income" ? "+" : "−"}
                        {formatCurrency(
                          Math.abs(Number(transaction.amount)),
                          currency,
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditForm(transaction)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteConfirm(transaction)}
                              className="text-destructive"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <TransactionFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        transactionToEdit={selectedTransaction}
      />
      <DeleteTransactionDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
      />
    </>
  );
}
