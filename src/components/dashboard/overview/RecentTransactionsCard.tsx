import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboardStore";
import { formatCurrency, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export function RecentTransactionsCard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: dashboardData } = useDashboardStore();
  const recentTransactions = dashboardData?.transactions.slice(0, 5) || [];
  const currency = dashboardData?.project.settings.currency || "BRL";
  const transactionsHref = projectId
    ? `/project/${projectId}/transactions`
    : "/";

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="font-display text-xl font-semibold">
              Atividade recente
            </CardTitle>
            <CardDescription>Últimas movimentações.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to={transactionsHref}>Ver todas</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-1">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
              >
                <div
                  className={cn(
                    "mr-3 rounded-full p-2",
                    transaction.type === "income"
                      ? "bg-success/15"
                      : "bg-destructive/15",
                  )}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="truncate font-medium leading-tight">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div
                  className={cn(
                    "ml-2 shrink-0 font-semibold tabular-nums text-sm",
                    transaction.type === "income"
                      ? "text-success"
                      : "text-foreground",
                  )}
                >
                  {transaction.type === "income" ? "+" : "−"}
                  {formatCurrency(Math.abs(Number(transaction.amount)), currency)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação"
            description="As movimentações recentes aparecerão aqui."
            className="py-10 border-0 bg-transparent"
          />
        )}
      </CardContent>
    </Card>
  );
}
