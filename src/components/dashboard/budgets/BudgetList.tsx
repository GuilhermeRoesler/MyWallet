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
import { Progress } from "@/components/ui/progress";
import { Button } from "../../ui/button";
import { MoreVertical, PlusCircle } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { BudgetFormDialog } from "./BudgetFormDialog";
import { DeleteBudgetDialog } from "./DeleteBudgetDialog";
import { Budget } from "@/types";

const getBudgetStatus = (spent: number, allocated: number): { status: "on-track" | "overspent" | "underused", progress: number } => {
    const progress = allocated > 0 ? (spent / allocated) * 100 : 0;
    if (progress > 100) return { status: "overspent", progress };
    if (progress < 50) return { status: "underused", progress };
    return { status: "on-track", progress };
}

export function BudgetList() {
  const { data, createItem, updateItem, deleteItem } = useDashboardStore();
  const budgets = data?.budgets || [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      if (selectedBudget) {
        await updateItem("budget", { ...values, id: selectedBudget.id });
      } else {
        await createItem("budget", values);
      }
      setIsFormOpen(false);
      setSelectedBudget(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedBudget) {
      setIsSubmitting(true);
      try {
        await deleteItem("budget", selectedBudget.id);
        setIsDeleteConfirmOpen(false);
        setSelectedBudget(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const openCreateForm = () => {
    setSelectedBudget(null);
    setIsFormOpen(true);
  };

  const openEditForm = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Budgets</CardTitle>
            <CardDescription>Track your spending against your allocated budgets for the current month.</CardDescription>
          </div>
          <Button onClick={openCreateForm}><PlusCircle className="mr-2 h-4 w-4" /> Novo Orçamento</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const spent = Number(budget.spent);
                const allocated = Number(budget.allocated);
                const { status, progress } = getBudgetStatus(spent, allocated);
                
                let progressColorClass = "bg-primary";
                let badgeVariant: "default" | "secondary" | "destructive" = "default";

                if (status === "overspent") {
                  progressColorClass = "bg-red-500";
                  badgeVariant = "destructive";
                } else if (status === "underused") {
                  progressColorClass = "bg-yellow-500";
                  badgeVariant = "secondary";
                }

                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.category}</TableCell>
                    <TableCell className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(allocated)}</TableCell>
                    <TableCell className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(spent)}</TableCell>
                    <TableCell className="text-center"><Progress value={progress > 100 ? 100 : progress} className="w-[100px]" indicatorClassName={progressColorClass} /></TableCell>
                    <TableCell className="text-center"><Badge variant={badgeVariant}>{status.replace("-", " ")}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditForm(budget)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteConfirm(budget)} className="text-red-500">Excluir</DropdownMenuItem>
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
      <BudgetFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        budgetToEdit={selectedBudget}
      />
      <DeleteBudgetDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
      />
    </>
  );
}