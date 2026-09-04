const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_CURRENCY = "BRL";

export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || DEFAULT_CURRENCY,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
    }).format(amount);
  }
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
): string {
  const value =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)
      ? (() => {
          const [y, m, d] = date.slice(0, 10).split("-").map(Number);
          return new Date(y, m - 1, d, 12);
        })()
      : new Date(date);
  return value.toLocaleDateString(DEFAULT_LOCALE, options);
}

export function formatChartDate(date: string | Date): string {
  const value =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)
      ? (() => {
          const [y, m, d] = date.slice(0, 10).split("-").map(Number);
          return new Date(y, m - 1, d, 12);
        })()
      : new Date(date);
  return value.toLocaleDateString(DEFAULT_LOCALE, {
    day: "numeric",
    month: "short",
  });
}

export function signedCurrency(
  amount: number,
  type: "income" | "expense" | "neutral" = "neutral",
  currency: string = DEFAULT_CURRENCY,
): string {
  const abs = Math.abs(amount);
  const formatted = formatCurrency(abs, currency);
  if (type === "income" || amount > 0) return `+${formatted}`;
  if (type === "expense" || amount < 0) return `−${formatted}`;
  return formatted;
}
