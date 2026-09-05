import {
  LayoutDashboard,
  Wallet,
  ListChecks,
  PiggyBank,
  BarChart,
  Settings,
  Folders,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  id: string;
  title: string;
  hint?: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
};

function projectBase(projectId?: string) {
  return projectId ? `/project/${projectId}` : "/projetos";
}

/** Rotas principais do projeto — usadas no dock flutuante. */
export function getDockNavItems(projectId?: string): AppNavItem[] {
  const base = projectBase(projectId);
  return [
    {
      id: "overview",
      title: "Visão geral",
      hint: "Dashboard",
      href: base,
      icon: LayoutDashboard,
      end: true,
    },
    {
      id: "accounts",
      title: "Contas",
      hint: "Saldos e tipos",
      href: `${base}/accounts`,
      icon: Wallet,
    },
    {
      id: "transactions",
      title: "Transações",
      hint: "Receitas e despesas",
      href: `${base}/transactions`,
      icon: ListChecks,
    },
    {
      id: "budgets",
      title: "Orçamentos",
      hint: "Limites por categoria",
      href: `${base}/budgets`,
      icon: PiggyBank,
    },
    {
      id: "reports",
      title: "Relatórios",
      hint: "Análise do período",
      href: `${base}/reports`,
      icon: BarChart,
    },
    {
      id: "settings",
      title: "Configurações",
      hint: "Aparência e perfil",
      href: `${base}/settings`,
      icon: Settings,
    },
  ];
}

/** Todas as rotas navegáveis (dock + projetos) — command palette. */
export function getCommandNavItems(projectId?: string): AppNavItem[] {
  return [
    ...getDockNavItems(projectId),
    {
      id: "projects",
      title: "Projetos",
      hint: "Trocar de workspace",
      href: "/projetos",
      icon: Folders,
    },
  ];
}
