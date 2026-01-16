import type {
  Account,
  BalanceOverTimeData,
  Budget,
  Overview,
  Project,
  Reports,
  Transaction,
} from "@/types";

function startOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function computeBudgetSpent(
  budgets: Omit<Budget, "spent">[],
  transactions: Transaction[],
): Budget[] {
  const monthStart = startOfMonth();

  return budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          new Date(t.date) >= monthStart,
      )
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    return { ...budget, spent };
  });
}

export function computeOverview(
  accounts: Account[],
  transactions: Transaction[],
): Overview {
  const monthStart = startOfMonth();
  const monthly = transactions.filter((t) => new Date(t.date) >= monthStart);

  return {
    totalBalance: accounts.reduce((sum, a) => sum + Number(a.balance), 0),
    monthlyIncome: monthly
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
    monthlyExpense: monthly
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
  };
}

export function computeReports(transactions: Transaction[]): Reports {
  const monthStart = startOfMonth();
  const byCategory = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== "expense" || new Date(t.date) < monthStart) continue;
    const prev = byCategory.get(t.category) ?? 0;
    byCategory.set(t.category, prev + Math.abs(Number(t.amount)));
  }

  return {
    spendingByCategory: Array.from(byCategory.entries()).map(
      ([category, total]) => ({
        category,
        total: total.toFixed(2),
      }),
    ),
  };
}

export function computeBalanceOverTime(
  accounts: Account[],
  transactions: Transaction[],
  days = 30,
): BalanceOverTimeData[] {
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result: BalanceOverTimeData[] = [];
  let running = totalBalance;

  // Work backwards from today, undoing each day's net change
  const dailyNet = new Map<string, number>();
  for (const t of transactions) {
    const key = t.date.slice(0, 10);
    const signed =
      t.type === "income"
        ? Math.abs(Number(t.amount))
        : -Math.abs(Number(t.amount));
    dailyNet.set(key, (dailyNet.get(key) ?? 0) + signed);
  }

  const points: BalanceOverTimeData[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = toISODate(d);
    points.push({ date: key, balance: running });
    running -= dailyNet.get(key) ?? 0;
  }

  return points.reverse();
}

export function buildDashboardView(project: Project) {
  const budgets = computeBudgetSpent(project.budgets, project.transactions);
  const overview = computeOverview(project.accounts, project.transactions);
  const reports = computeReports(project.transactions);
  const balanceOverTime = computeBalanceOverTime(
    project.accounts,
    project.transactions,
  );

  return {
    project,
    accounts: project.accounts,
    transactions: [...project.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    budgets,
    reports,
    overview,
    balanceOverTime,
    user: {
      id: project.id,
      name: project.settings.ownerName,
      email: "local@my-wallet.app",
      theme: project.settings.theme,
      email_notifications: project.settings.email_notifications ? "1" : "0",
      push_notifications: project.settings.push_notifications ? "1" : "0",
      monthly_reports: project.settings.monthly_reports ? "1" : "0",
    },
  };
}
