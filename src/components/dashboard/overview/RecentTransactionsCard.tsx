import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboardStore";

export function RecentTransactionsCard() {
  const { data: dashboardData } = useDashboardStore();
  const recentTransactions = dashboardData?.transactions.slice(0, 4) || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/transactions">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(transaction.amount))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent transactions found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}