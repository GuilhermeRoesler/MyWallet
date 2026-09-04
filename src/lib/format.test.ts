import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, signedCurrency } from "./format";

describe("formatCurrency", () => {
  it("formata valores em BRL (pt-BR)", () => {
    expect(formatCurrency(1234.5)).toMatch(/R\$\s*1\.234,50/);
  });

  it("usa BRL como fallback para moeda inválida", () => {
    expect(formatCurrency(10, "INVALID")).toMatch(/R\$\s*10,00/);
  });
});

describe("formatDate", () => {
  it("formata datas ISO sem deslocar o dia por fuso", () => {
    expect(formatDate("2024-01-15")).toBe("15/01/2024");
  });
});

describe("signedCurrency", () => {
  it("prefixa + para receita", () => {
    expect(signedCurrency(100, "income")).toMatch(/^\+.*100,00/);
  });

  it("prefixa − para despesa", () => {
    expect(signedCurrency(50, "expense")).toMatch(/^−.*50,00/);
  });
});
