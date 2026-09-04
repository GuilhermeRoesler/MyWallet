export const CATEGORY_OPTIONS = [
  { value: "Income", label: "Receita" },
  { value: "Housing", label: "Moradia" },
  { value: "Food", label: "Alimentação" },
  { value: "Food & Groceries", label: "Mercado" },
  { value: "Dining", label: "Restaurantes" },
  { value: "Transportation", label: "Transporte" },
  { value: "Entertainment", label: "Lazer" },
  { value: "Utilities", label: "Contas" },
  { value: "Shopping", label: "Compras" },
  { value: "Health", label: "Saúde" },
  { value: "Savings", label: "Poupança" },
] as const;

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
);

export const BUDGET_CATEGORY_OPTIONS = CATEGORY_OPTIONS.filter(
  (c) => c.value !== "Income" && c.value !== "Savings",
);

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  Bank: "Banco",
  "Credit Card": "Cartão de crédito",
  Investment: "Investimento",
  Savings: "Poupança",
};

export function accountTypeLabel(type: string): string {
  return ACCOUNT_TYPE_LABELS[type] ?? type;
}

export const ACCOUNT_STATUS_LABELS: Record<string, string> = {
  active: "Ativa",
  inactive: "Inativa",
  pending: "Pendente",
};

export function accountStatusLabel(status: string): string {
  return ACCOUNT_STATUS_LABELS[status] ?? status;
}

export const BUDGET_STATUS_LABELS: Record<string, string> = {
  "on-track": "No prazo",
  overspent: "Estourado",
  underused: "Subutilizado",
};

export function budgetStatusLabel(status: string): string {
  return BUDGET_STATUS_LABELS[status] ?? status;
}
