import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboardStore";
import { computeInsights } from "@/lib/compute";
import { formatCurrency } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

type InsightBannerProps = {
  /** Empilha os cards (útil na coluna lateral do bento). */
  stacked?: boolean;
};

export function InsightBanner({ stacked = false }: InsightBannerProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const { data } = useDashboardStore();
  if (!data?.overview || !data.budgets) return null;

  const currency = data.project.settings.currency || "BRL";
  const insights = computeInsights(
    data.budgets,
    data.overview,
    data.reports.spendingByCategory,
  );

  const cards: {
    key: string;
    tone: "success" | "danger" | "primary";
    icon: typeof TrendingUp;
    title: string;
    description: string;
    href?: string;
  }[] = [];

  if (insights.overspent[0]) {
    const worst = insights.overspent[0];
    cards.push({
      key: "overspent",
      tone: "danger",
      icon: AlertTriangle,
      title: `${categoryLabel(worst.category)} em ${Math.round(worst.ratio * 100)}% do orçamento`,
      description: `Gasto ${formatCurrency(worst.spent, currency)} de ${formatCurrency(worst.allocated, currency)} neste mês.`,
      href: projectId ? `/project/${projectId}/budgets` : undefined,
    });
  }

  cards.push({
    key: "net",
    tone: insights.netFlow >= 0 ? "success" : "danger",
    icon: TrendingUp,
    title:
      insights.netFlow >= 0
        ? `Fluxo líquido de ${formatCurrency(insights.netFlow, currency)}`
        : `Déficit de ${formatCurrency(Math.abs(insights.netFlow), currency)}`,
    description:
      insights.netFlow >= 0
        ? "Receitas superam despesas no mês — bom sinal de saúde financeira."
        : "Despesas acima das receitas neste mês. Vale revisar os maiores gastos.",
  });

  if (insights.topCategory && cards.length < 2) {
    cards.push({
      key: "top",
      tone: "primary",
      icon: Lightbulb,
      title: `Maior gasto: ${categoryLabel(insights.topCategory.category)}`,
      description: `${formatCurrency(insights.topCategory.total, currency)} no mês — a categoria que mais pesa no orçamento.`,
      href: projectId ? `/project/${projectId}/reports` : undefined,
    });
  }

  const visible = cards.slice(0, 2);

  return (
    <div
      className={cn(
        "grid gap-3 animate-rise-delay-1",
        stacked ? "grid-cols-1 h-full" : "sm:grid-cols-2",
      )}
    >
      {visible.map((card) => {
        const Icon = card.icon;
        const content = (
          <>
            <div
              className={cn(
                "rounded-lg p-2 shrink-0",
                card.tone === "success" && "bg-success/10 text-success",
                card.tone === "danger" && "bg-destructive/10 text-destructive",
                card.tone === "primary" && "bg-primary/10 text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium leading-snug text-foreground">
                {card.title}
              </p>
              <p className="text-xs leading-relaxed text-foreground/65">
                {card.description}
              </p>
            </div>
          </>
        );

        const className = cn(
          "flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-md",
          stacked && "flex-1",
          card.tone === "danger" && "border-destructive/25",
          card.tone === "success" && "border-success/25",
          card.tone === "primary" && "border-primary/20",
        );

        if (card.href) {
          return (
            <Link key={card.key} to={card.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <div key={card.key} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
