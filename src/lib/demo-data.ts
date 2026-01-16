import type { Project } from "@/types";
import { createId } from "@/lib/storage";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Projeto demo padrão — dados ricos para demonstrar o dashboard. */
export function createDemoProject(): Project {
  const now = new Date().toISOString();
  const accountBank = createId();
  const accountCard = createId();
  const accountInvest = createId();
  const accountSavings = createId();

  return {
    id: createId(),
    name: "Finanças Pessoais (Demo)",
    description:
      "Projeto de demonstração com contas, transações e orçamentos de exemplo. Explore o dashboard completo sem configurar nada.",
    createdAt: now,
    updatedAt: now,
    isDemo: true,
    settings: {
      ownerName: "Alex Demo",
      theme: "light",
      currency: "BRL",
      email_notifications: true,
      push_notifications: false,
      monthly_reports: true,
    },
    accounts: [
      {
        id: accountBank,
        name: "Conta Corrente Principal",
        type: "Bank",
        balance: 8450.75,
        currency: "BRL",
        status: "active",
      },
      {
        id: accountCard,
        name: "Cartão Platinum",
        type: "Credit Card",
        balance: -1850.4,
        currency: "BRL",
        status: "active",
      },
      {
        id: accountInvest,
        name: "Carteira de Investimentos",
        type: "Investment",
        balance: 32500.0,
        currency: "BRL",
        status: "active",
      },
      {
        id: accountSavings,
        name: "Reserva de Emergência",
        type: "Savings",
        balance: 12000.0,
        currency: "BRL",
        status: "active",
      },
    ],
    transactions: [
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(28),
        description: "Salário Mensal",
        category: "Income",
        amount: 8500,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(26),
        description: "Aluguel",
        category: "Housing",
        amount: 2200,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(24),
        description: "Supermercado Extra",
        category: "Food",
        amount: 420.5,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: daysAgo(22),
        description: "Restaurante Italiano",
        category: "Dining",
        amount: 186.9,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: daysAgo(20),
        description: "Fones Bluetooth",
        category: "Shopping",
        amount: 349.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(18),
        description: "Conta de Luz",
        category: "Utilities",
        amount: 210.3,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(16),
        description: "Combustível",
        category: "Transportation",
        amount: 280.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountInvest,
        date: daysAgo(14),
        description: "Aporte mensal ETF",
        category: "Savings",
        amount: 1000.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: daysAgo(12),
        description: "Cinema + pipoca",
        category: "Entertainment",
        amount: 78.5,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(10),
        description: "Freelance — landing page",
        category: "Income",
        amount: 1500.0,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(8),
        description: "Farmácia",
        category: "Health",
        amount: 95.2,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: daysAgo(6),
        description: "Assinatura streaming",
        category: "Entertainment",
        amount: 55.9,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: daysAgo(4),
        description: "Mercado semanal",
        category: "Food",
        amount: 312.8,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountSavings,
        date: daysAgo(3),
        description: "Transferência para reserva",
        category: "Savings",
        amount: 500.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: daysAgo(1),
        description: "Café com cliente",
        category: "Dining",
        amount: 42.0,
        type: "expense",
      },
    ],
    budgets: [
      { id: createId(), category: "Housing", allocated: 2500 },
      { id: createId(), category: "Food", allocated: 800 },
      { id: createId(), category: "Dining", allocated: 400 },
      { id: createId(), category: "Transportation", allocated: 400 },
      { id: createId(), category: "Entertainment", allocated: 250 },
      { id: createId(), category: "Shopping", allocated: 500 },
      { id: createId(), category: "Utilities", allocated: 350 },
    ],
  };
}

export function createEmptyProject(
  name: string,
  description: string,
): Project {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    isDemo: false,
    settings: {
      ownerName: "Você",
      theme: "light",
      currency: "BRL",
      email_notifications: true,
      push_notifications: false,
      monthly_reports: true,
    },
    accounts: [],
    transactions: [],
    budgets: [],
  };
}
