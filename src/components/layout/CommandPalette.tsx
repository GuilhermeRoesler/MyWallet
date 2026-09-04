import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Wallet,
  ListChecks,
  PiggyBank,
  BarChart,
  Settings,
  Folders,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  title: string;
  hint?: string;
  href: string;
  icon: LucideIcon;
};

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<CommandItem[]>(() => {
    const base = projectId ? `/project/${projectId}` : "/projetos";
    return [
      {
        id: "overview",
        title: "Visão geral",
        hint: "Dashboard",
        href: base,
        icon: LayoutDashboard,
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
      {
        id: "projects",
        title: "Projetos",
        hint: "Trocar de workspace",
        href: "/projetos",
        icon: Folders,
      },
    ];
  }, [projectId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.hint?.toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
    onOpenChange(next);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const run = useCallback(
    (href: string) => {
      setQuery("");
      setActiveIndex(0);
      onOpenChange(false);
      navigate(href);
    },
    [navigate, onOpenChange],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      run(filtered[activeIndex].href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-lg [&>button]:hidden"
        onKeyDown={onKeyDown}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Busca rápida</DialogTitle>
          <DialogDescription>Navegue pelas seções do app</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Buscar páginas…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            Esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado.
            </li>
          ) : (
            filtered.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => run(item.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span className="flex-1 font-medium">{item.title}</span>
                  {item.hint && (
                    <span
                      className={cn(
                        "text-xs",
                        index === activeIndex
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.hint}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center gap-3 border-t bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
          <span>
            <kbd className="rounded border bg-background px-1">↑↓</kbd> navegar
          </span>
          <span>
            <kbd className="rounded border bg-background px-1">↵</kbd> abrir
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Atalho global Ctrl/Cmd+K — montar no layout do dashboard. */
export function useCommandPaletteShortcut(
  onOpen: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen, enabled]);
}
