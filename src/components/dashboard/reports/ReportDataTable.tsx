import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency, formatDate } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { ListOrdered } from "lucide-react";

type ReportDataTableProps = {
  transactions?: Transaction[];
};

export function ReportDataTable({ transactions: propTx }: ReportDataTableProps) {
  const { data: dashboardData } = useDashboardStore();
  const transactions = propTx ?? dashboardData?.transactions ?? [];
  const currency = dashboardData?.project.settings.currency || "BRL";

  return (
    <Card className="border-border/80 shadow-sm h-full animate-rise-delay-1">
      <CardHeader className="pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="font-display text-xl font-semibold">
            Transações detalhadas
          </CardTitle>
          <span className="text-xs tabular-nums text-muted-foreground">
            {transactions.length} no período
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {transactions.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Sem transações"
            description="Não há movimentações neste período."
            className="mx-6 border-0 bg-transparent py-10"
          />
        ) : (
          <div className="max-h-[520px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-foreground/70">Data</TableHead>
                  <TableHead className="text-foreground/70">Descrição</TableHead>
                  <TableHead className="text-foreground/70">Categoria</TableHead>
                  <TableHead className="pr-6 text-right text-foreground/70">
                    Valor
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell className="pl-6 tabular-nums text-sm text-foreground/80">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate font-medium text-foreground sm:max-w-none">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-foreground/15 font-normal text-foreground/85"
                      >
                        {categoryLabel(transaction.category)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "pr-6 text-right font-semibold tabular-nums",
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
