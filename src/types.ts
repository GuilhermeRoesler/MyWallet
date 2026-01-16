export interface Account {
  id: string;
  name: string;
  type: "Bank" | "Credit Card" | "Investment" | "Savings" | string;
  balance: number;
  currency: string;
  status: "active" | "inactive" | "pending";
}

export interface Transaction {
  id: string;
  account_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
}

export interface ProjectSettings {
  ownerName: string;
  theme: string;
  currency: string;
  email_notifications: boolean;
  push_notifications: boolean;
  monthly_reports: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  settings: ProjectSettings;
  accounts: Account[];
  transactions: Transaction[];
  /** Budgets stored without spent; spent is computed at read time */
  budgets: Omit<Budget, "spent">[];
}

export interface SpendingByCategory {
  category: string;
  total: string;
}

export interface Reports {
  spendingByCategory: SpendingByCategory[];
}

export interface Overview {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface BalanceOverTimeData {
  date: string;
  balance: number;
}

export interface DashboardData {
  project: Project;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  reports: Reports;
  overview: Overview;
  balanceOverTime: BalanceOverTimeData[];
  user: {
    id: string;
    name: string;
    email: string;
    theme: string;
    email_notifications: string;
    push_notifications: string;
    monthly_reports: string;
  };
}

export type CrudItemType = "account" | "transaction" | "budget";

export interface ProjectFormValues {
  name: string;
  description: string;
}
