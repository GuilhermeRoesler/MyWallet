import { describe, expect, it } from "vitest";
import { computeInsights, computeOverview, computeReports } from "./compute";
import type { Account, Budget, Transaction } from "@/types";

describe("computeOverview", () => {
  it("soma saldos das contas", () => {
    const accounts: Account[] = [
      {
        id: "a1",
        name: "Conta",
        type: "Bank",
        balance: 1000,
        currency: "BRL",
        status: "active",
      },
      {
        id: "a2",
        name: "Poupança",
        type: "Savings",
        balance: 500.5,
        currency: "BRL",
        status: "active",
      },
    ];

    const overview = computeOverview(accounts, []);
    expect(overview.totalBalance).toBe(1500.5);
    expect(overview.monthlyIncome).toBe(0);
    expect(overview.monthlyExpense).toBe(0);
  });

  it("calcula receita e despesa do mês corrente", () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const accounts: Account[] = [
      {
        id: "a1",
        name: "Conta",
        type: "Bank",
        balance: 0,
        currency: "BRL",
        status: "active",
      },
    ];

    const transactions: Transaction[] = [
      {
        id: "t1",
        account_id: "a1",
        type: "income",
        amount: 200,
        category: "salary",
        description: "Salário",
        date: iso,
      },
      {
        id: "t2",
        account_id: "a1",
        type: "expense",
        amount: 75,
        category: "food",
        description: "Mercado",
        date: iso,
      },
    ];

    const overview = computeOverview(accounts, transactions);
    expect(overview.monthlyIncome).toBe(200);
    expect(overview.monthlyExpense).toBe(75);
  });
});

describe("computeInsights", () => {
  it("detecta orçamento estourado e fluxo líquido", () => {
    const budgets: Budget[] = [
      { id: "b1", category: "Dining", allocated: 100, spent: 150 },
      { id: "b2", category: "Housing", allocated: 2000, spent: 1800 },
    ];
    const overview = {
      totalBalance: 5000,
      monthlyIncome: 9000,
      monthlyExpense: 4000,
    };
    const spending = [
      { category: "Housing", total: "1800" },
      { category: "Dining", total: "150" },
    ];

    const insights = computeInsights(budgets, overview, spending);
    expect(insights.overspent).toHaveLength(1);
    expect(insights.overspent[0].category).toBe("Dining");
    expect(insights.netFlow).toBe(5000);
    expect(insights.topCategory?.category).toBe("Housing");
  });
});

describe("computeReports", () => {
  it("respeita intervalo de datas", () => {
    const transactions: Transaction[] = [
      {
        id: "t1",
        account_id: "a1",
        type: "expense",
        amount: 100,
        category: "Food",
        description: "A",
        date: "2026-01-10",
      },
      {
        id: "t2",
        account_id: "a1",
        type: "expense",
        amount: 50,
        category: "Food",
        description: "B",
        date: "2026-03-10",
      },
    ];

    const reports = computeReports(transactions, {
      from: new Date(2026, 0, 1),
      to: new Date(2026, 0, 31),
    });

    expect(reports.spendingByCategory).toHaveLength(1);
    expect(reports.spendingByCategory[0].total).toBe("100.00");
  });
});
