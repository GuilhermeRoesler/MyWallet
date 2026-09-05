import type { Project } from "@/types";
import { createId } from "@/lib/storage";

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Dia do mês atual (limitado a hoje). */
function thisMonth(day: number): string {
  const now = new Date();
  const clamped = Math.max(1, Math.min(day, now.getDate()));
  return toISODate(new Date(now.getFullYear(), now.getMonth(), clamped, 12));
}

/** Dia do mês anterior (para histórico do gráfico de saldo). */
function lastMonth(day: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, day, 12);
  return toISODate(d);
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
    name: "Finanças Pessoais",
    description:
      "Workspace de exemplo com contas, transações e orçamentos prontos para explorar.",
    createdAt: now,
    updatedAt: now,
    isDemo: true,
    settings: {
      ownerName: "Alex",
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
      // —— Mês anterior (histórico do gráfico) ——
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(5),
        description: "Salário Mensal",
        category: "Income",
        amount: 8500,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(6),
        description: "Aluguel",
        category: "Housing",
        amount: 2200,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(8),
        description: "Supermercado Extra",
        category: "Food",
        amount: 380.5,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: lastMonth(12),
        description: "Restaurante Japonês",
        category: "Dining",
        amount: 210.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountInvest,
        date: lastMonth(15),
        description: "Aporte mensal ETF",
        category: "Savings",
        amount: 1000.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(20),
        description: "Freelance — landing page",
        category: "Income",
        amount: 1500.0,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(22),
        description: "Combustível",
        category: "Transportation",
        amount: 260.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: lastMonth(25),
        description: "Fones Bluetooth",
        category: "Shopping",
        amount: 349.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(7),
        description: "Farmácia",
        category: "Health",
        amount: 186.4,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: lastMonth(10),
        description: "Jantar aniversário",
        category: "Dining",
        amount: 420.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(14),
        description: "Dividendos FIIs",
        category: "Income",
        amount: 680.0,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(16),
        description: "Conta de luz",
        category: "Utilities",
        amount: 245.8,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountInvest,
        date: lastMonth(18),
        description: "Resgate parcial CDB",
        category: "Income",
        amount: 2500.0,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(24),
        description: "Manutenção carro",
        category: "Transportation",
        amount: 890.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountSavings,
        date: lastMonth(27),
        description: "Transferência para reserva",
        category: "Savings",
        amount: 1500.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: lastMonth(28),
        description: "Consultoria pontual",
        category: "Income",
        amount: 2200.0,
        type: "income",
      },

      // —— Mês atual (orçamentos + relatórios) ——
      // Housing ~88%
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(1),
        description: "Salário Mensal",
        category: "Income",
        amount: 8500,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(2),
        description: "Aluguel",
        category: "Housing",
        amount: 2200,
        type: "expense",
      },
      // Food ~91%
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(3),
        description: "Mercado semanal",
        category: "Food",
        amount: 412.8,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(8, new Date().getDate())),
        description: "Feira e hortifruti",
        category: "Food",
        amount: 318.4,
        type: "expense",
      },
      // Dining ~120% ESTOURADO
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(4, new Date().getDate())),
        description: "Restaurante Italiano",
        category: "Dining",
        amount: 186.9,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(6, new Date().getDate())),
        description: "Almoço com equipe",
        category: "Dining",
        amount: 158.5,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(9, new Date().getDate())),
        description: "Café com cliente",
        category: "Dining",
        amount: 64.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(11, new Date().getDate())),
        description: "Delivery jantar",
        category: "Dining",
        amount: 78.9,
        type: "expense",
      },
      // Transportation ~78%
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(5, new Date().getDate())),
        description: "Combustível",
        category: "Transportation",
        amount: 210.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(10, new Date().getDate())),
        description: "Estacionamento",
        category: "Transportation",
        amount: 98.0,
        type: "expense",
      },
      // Entertainment ~84%
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(3, new Date().getDate())),
        description: "Assinatura streaming",
        category: "Entertainment",
        amount: 55.9,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(7, new Date().getDate())),
        description: "Cinema + pipoca",
        category: "Entertainment",
        amount: 89.5,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(12, new Date().getDate())),
        description: "Show ao vivo",
        category: "Entertainment",
        amount: 65.0,
        type: "expense",
      },
      // Shopping ~90%
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(4, new Date().getDate())),
        description: "Roupas de trabalho",
        category: "Shopping",
        amount: 289.0,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountCard,
        date: thisMonth(Math.min(9, new Date().getDate())),
        description: "Presente aniversário",
        category: "Shopping",
        amount: 160.0,
        type: "expense",
      },
      // Utilities ~80%
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(5, new Date().getDate())),
        description: "Conta de Luz",
        category: "Utilities",
        amount: 178.3,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(6, new Date().getDate())),
        description: "Internet fibra",
        category: "Utilities",
        amount: 109.9,
        type: "expense",
      },
      // Health ~75%
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(7, new Date().getDate())),
        description: "Farmácia",
        category: "Health",
        amount: 95.2,
        type: "expense",
      },
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(10, new Date().getDate())),
        description: "Consulta rápida",
        category: "Health",
        amount: 55.0,
        type: "expense",
      },
      // Extra income + savings (não entram em orçamento)
      {
        id: createId(),
        account_id: accountBank,
        date: thisMonth(Math.min(8, new Date().getDate())),
        description: "Adiantamento bônus",
        category: "Income",
        amount: 1200.0,
        type: "income",
      },
      {
        id: createId(),
        account_id: accountSavings,
        date: thisMonth(Math.min(3, new Date().getDate())),
        description: "Transferência para reserva",
        category: "Savings",
        amount: 500.0,
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
      { id: createId(), category: "Health", allocated: 200 },
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
