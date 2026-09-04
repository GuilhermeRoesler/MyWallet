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

export function ReportDataTable() {
  const { data: dashboardData } = useDashboardStore();
  const transactions = dashboardData?.transactions || [];
  const currency = dashboardData?.project.settings.currency || "BRL";

  return (
    <Card className="border-border/80 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="font-display text-xl font-semibold">
          Transações detalhadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {categoryLabel(transaction.category)}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
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
      </CardContent>
    </Card>
  );
}
