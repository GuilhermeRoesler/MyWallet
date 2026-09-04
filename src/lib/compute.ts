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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Evita o parse UTC de `YYYY-MM-DD` (que atrasa 1 dia em fusos negativos). */
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
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
          parseLocalDate(t.date) >= monthStart,
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
  const monthly = transactions.filter(
    (t) => parseLocalDate(t.date) >= monthStart,
  );

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

export type DateRangeFilter = {
  from: Date;
  to: Date;
};

function rangeBounds(range?: DateRangeFilter): { start: Date; end: Date } {
  if (range?.from && range?.to) {
    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range.to);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  const start = startOfMonth();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function filterTransactionsByRange(
  transactions: Transaction[],
  range?: DateRangeFilter,
): Transaction[] {
  const { start, end } = rangeBounds(range);
  return transactions.filter((t) => {
    const d = parseLocalDate(t.date);
    return d >= start && d <= end;
  });
}

export function computePeriodTotals(transactions: Transaction[]) {
  return {
    income: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
    expense: transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
  };
}

export function computeReports(
  transactions: Transaction[],
  range?: DateRangeFilter,
): Reports {
  const { start, end } = rangeBounds(range);
  const byCategory = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const d = parseLocalDate(t.date);
    if (d < start || d > end) continue;
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

export type OverspentBudget = {
  category: string;
  spent: number;
  allocated: number;
  ratio: number;
};

export type FinancialInsights = {
  overspent: OverspentBudget[];
  netFlow: number;
  topCategory: { category: string; total: number } | null;
};

/** Insights narrativos para a visão geral (orçamentos + fluxo do mês). */
export function computeInsights(
  budgets: Budget[],
  overview: Overview,
  spendingByCategory: { category: string; total: string }[],
): FinancialInsights {
  const overspent = budgets
    .filter((b) => b.allocated > 0 && b.spent > b.allocated)
    .map((b) => ({
      category: b.category,
      spent: b.spent,
      allocated: b.allocated,
      ratio: b.spent / b.allocated,
    }))
    .sort((a, b) => b.ratio - a.ratio);

  const top = [...spendingByCategory]
    .map((item) => ({
      category: item.category,
      total: Math.abs(Number(item.total)),
    }))
    .filter((item) => item.category !== "Savings" && item.category !== "Income")
    .sort((a, b) => b.total - a.total)[0];

  return {
    overspent,
    netFlow: overview.monthlyIncome - overview.monthlyExpense,
    topCategory: top ?? null,
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
      (a, b) =>
        parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime(),
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
