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
import { Progress } from "@/components/ui/progress";
import { Button } from "../../ui/button";
import { MoreVertical, PiggyBank, PlusCircle } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { BudgetFormDialog } from "./BudgetFormDialog";
import { DeleteBudgetDialog } from "./DeleteBudgetDialog";
import { Budget } from "@/types";
import { formatCurrency } from "@/lib/format";
import { budgetStatusLabel, categoryLabel } from "@/lib/labels";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const getBudgetStatus = (
  spent: number,
  allocated: number,
): { status: "on-track" | "overspent" | "underused"; progress: number } => {
  const progress = allocated > 0 ? (spent / allocated) * 100 : 0;
  if (progress > 100) return { status: "overspent", progress };
  if (progress < 50) return { status: "underused", progress };
  return { status: "on-track", progress };
};

export function BudgetList() {
  const { data, createItem, updateItem, deleteItem } = useDashboardStore();
  const budgets = data?.budgets || [];
  const currency = data?.project.settings.currency || "BRL";

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
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-display text-xl font-semibold">
              Seus orçamentos
            </CardTitle>
            <CardDescription className="text-foreground/65">
              Acompanhe o gasto em relação ao valor alocado neste mês.
            </CardDescription>
          </div>
          <Button onClick={openCreateForm} className="w-full shrink-0 sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo orçamento
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {budgets.length === 0 ? (
            <EmptyState
              icon={PiggyBank}
              title="Nenhum orçamento"
              description="Defina limites por categoria para manter o controle."
              actionLabel="Novo orçamento"
              onAction={openCreateForm}
              className="border-0 bg-transparent"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Alocado</TableHead>
                  <TableHead className="text-right">Gasto</TableHead>
                  <TableHead className="text-center">Progresso</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => {
                  const spent = Number(budget.spent);
                  const allocated = Number(budget.allocated);
                  const { status, progress } = getBudgetStatus(spent, allocated);

                  let progressColorClass = "bg-primary";
                  let badgeVariant: "default" | "secondary" | "destructive" =
                    "default";

                  if (status === "overspent") {
                    progressColorClass = "bg-destructive";
                    badgeVariant = "destructive";
                  } else if (status === "underused") {
                    progressColorClass = "bg-warning";
                    badgeVariant = "secondary";
                  }

                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">
                        {categoryLabel(budget.category)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(allocated, currency)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(spent, currency)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Progress
                          value={progress > 100 ? 100 : progress}
                          className="mx-auto w-[100px]"
                          indicatorClassName={progressColorClass}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={badgeVariant}
                          className={cn(
                            status === "on-track" && "bg-success text-success-foreground",
                          )}
                        >
                          {budgetStatusLabel(status)}
                        </Badge>
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
                              onClick={() => openEditForm(budget)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteConfirm(budget)}
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
