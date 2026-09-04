import { describe, expect, it } from "vitest";
import { computeOverview } from "./compute";
import type { Account, Transaction } from "@/types";

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
