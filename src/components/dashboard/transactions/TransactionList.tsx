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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Home, Coffee, ArrowDownCircle, Car, ShoppingCart, Film, FileText, MoreVertical, PlusCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { TransactionFormDialog } from "./TransactionFormDialog";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { Transaction } from "@/types";

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
};

export function TransactionList() {
  const { data, createItem, updateItem, deleteItem } = useDashboardStore();
  const transactions = data?.transactions || [];
  const accounts = data?.accounts || [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>A detailed list of your financial transactions.</CardDescription>
          </div>
          <Button onClick={openCreateForm}><PlusCircle className="mr-2 h-4 w-4" /> Nova Transação</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const Icon = categoryIcons[transaction.category] || Utensils;
                const account = accounts.find(acc => acc.id === transaction.account_id);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500/10' : 'bg-secondary'}`}>
                          <Icon className={`h-5 w-5 ${transaction.type === 'income' ? 'text-green-500' : 'text-muted-foreground'}`} />
                        </div>
                        <span>{transaction.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account?.name || 'N/A'}</TableCell>
                    <TableCell><Badge variant="outline">{transaction.category}</Badge></TableCell>
                    <TableCell className={`text-right font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-destructive'}`}>
                      {transaction.type === 'income' ? '+' : ''}
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(transaction.amount))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditForm(transaction)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteConfirm(transaction)} className="text-red-500">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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