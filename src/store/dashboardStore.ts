import { create } from "zustand";
import type {
  Account,
  Budget,
  CrudItemType,
  DashboardData,
  Transaction,
} from "@/types";
import { buildDashboardView } from "@/lib/compute";
import { createId } from "@/lib/storage";
import { useProjectStore } from "@/store/projectStore";
import { showError, showSuccess } from "@/utils/toast";

interface DashboardState {
  data: DashboardData | null;
  projectId: string | null;
  isLoading: boolean;
  error: string | null;
  loadProject: (projectId: string) => void;
  clear: () => void;
  createItem: (
    type: CrudItemType,
    values: Record<string, unknown>,
  ) => Promise<void>;
  updateItem: (
    type: CrudItemType,
    values: Record<string, unknown>,
  ) => Promise<void>;
  deleteItem: (type: CrudItemType, id: string) => Promise<void>;
}

function refreshFromStore(projectId: string): DashboardData | null {
  const project = useProjectStore.getState().getProject(projectId);
  if (!project) return null;
  return buildDashboardView(project);
}

function applyAccountBalanceOnTransaction(
  accounts: Account[],
  tx: Pick<Transaction, "account_id" | "amount" | "type">,
  direction: 1 | -1,
): Account[] {
  const delta =
    (tx.type === "income"
      ? Math.abs(Number(tx.amount))
      : -Math.abs(Number(tx.amount))) * direction;

  return accounts.map((a) =>
    a.id === tx.account_id ? { ...a, balance: Number(a.balance) + delta } : a,
  );
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  projectId: null,
  isLoading: false,
  error: null,

  loadProject: (projectId) => {
    set({ isLoading: true, error: null, projectId });
    const data = refreshFromStore(projectId);
    if (!data) {
      set({
        data: null,
        isLoading: false,
        error: "Projeto não encontrado.",
      });
      return;
    }
    set({ data, isLoading: false });
  },

  clear: () => set({ data: null, projectId: null, error: null, isLoading: false }),

  createItem: async (type, values) => {
    const { projectId } = get();
    if (!projectId) return;

    const project = useProjectStore.getState().getProject(projectId);
    if (!project) {
      showError("Projeto não encontrado.");
      return;
    }

    try {
      let next = { ...project };

      if (type === "account") {
        const account: Account = {
          id: createId(),
          name: String(values.name),
          type: String(values.type),
          balance: Number(values.balance) || 0,
          currency: String(values.currency || project.settings.currency || "BRL"),
          status: (values.status as Account["status"]) || "active",
        };
        next = { ...next, accounts: [...next.accounts, account] };
      }

      if (type === "transaction") {
        const tx: Transaction = {
          id: createId(),
          account_id: String(values.account_id),
          date: String(values.date),
          description: String(values.description),
          category: String(values.category),
          amount: Math.abs(Number(values.amount)),
          type: values.type as Transaction["type"],
        };
        next = {
          ...next,
          transactions: [...next.transactions, tx],
          accounts: applyAccountBalanceOnTransaction(next.accounts, tx, 1),
        };
      }

      if (type === "budget") {
        const budget: Omit<Budget, "spent"> = {
          id: createId(),
          category: String(values.category),
          allocated: Number(values.allocated),
        };
        next = { ...next, budgets: [...next.budgets, budget] };
      }

      useProjectStore.getState().saveProject(next);
      set({ data: buildDashboardView(next) });
      showSuccess(
        type === "account"
          ? "Conta criada."
          : type === "transaction"
            ? "Transação criada."
            : "Orçamento criado.",
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar.";
      showError(message);
      throw error;
    }
  },

  updateItem: async (type, values) => {
    const { projectId } = get();
    if (!projectId) return;

    const project = useProjectStore.getState().getProject(projectId);
    if (!project) {
      showError("Projeto não encontrado.");
      return;
    }

    try {
      let next = { ...project };
      const id = String(values.id);

      if (type === "account") {
        next = {
          ...next,
          accounts: next.accounts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  name: String(values.name ?? a.name),
                  type: String(values.type ?? a.type),
                  balance: Number(values.balance ?? a.balance),
                  currency: String(values.currency ?? a.currency),
                  status: (values.status as Account["status"]) ?? a.status,
                }
              : a,
          ),
        };
      }

      if (type === "transaction") {
        const oldTx = next.transactions.find((t) => t.id === id);
        if (!oldTx) throw new Error("Transação não encontrada.");

        let accounts = applyAccountBalanceOnTransaction(
          next.accounts,
          oldTx,
          -1,
        );

        const updated: Transaction = {
          ...oldTx,
          account_id: String(values.account_id ?? oldTx.account_id),
          date: String(values.date ?? oldTx.date),
          description: String(values.description ?? oldTx.description),
          category: String(values.category ?? oldTx.category),
          amount: Math.abs(Number(values.amount ?? oldTx.amount)),
          type: (values.type as Transaction["type"]) ?? oldTx.type,
        };

        accounts = applyAccountBalanceOnTransaction(accounts, updated, 1);

        next = {
          ...next,
          accounts,
          transactions: next.transactions.map((t) =>
            t.id === id ? updated : t,
          ),
        };
      }

      if (type === "budget") {
        next = {
          ...next,
          budgets: next.budgets.map((b) =>
            b.id === id
              ? {
                  ...b,
                  category: String(values.category ?? b.category),
                  allocated: Number(values.allocated ?? b.allocated),
                }
              : b,
          ),
        };
      }

      useProjectStore.getState().saveProject(next);
      set({ data: buildDashboardView(next) });
      showSuccess(
        type === "account"
          ? "Conta atualizada."
          : type === "transaction"
            ? "Transação atualizada."
            : "Orçamento atualizado.",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar.";
      showError(message);
      throw error;
    }
  },

  deleteItem: async (type, id) => {
    const { projectId } = get();
    if (!projectId) return;

    const project = useProjectStore.getState().getProject(projectId);
    if (!project) {
      showError("Projeto não encontrado.");
      return;
    }

    try {
      let next = { ...project };

      if (type === "account") {
        next = {
          ...next,
          accounts: next.accounts.filter((a) => a.id !== id),
          transactions: next.transactions.filter((t) => t.account_id !== id),
        };
      }

      if (type === "transaction") {
        const tx = next.transactions.find((t) => t.id === id);
        if (tx) {
          next = {
            ...next,
            accounts: applyAccountBalanceOnTransaction(next.accounts, tx, -1),
            transactions: next.transactions.filter((t) => t.id !== id),
          };
        }
      }

      if (type === "budget") {
        next = {
          ...next,
          budgets: next.budgets.filter((b) => b.id !== id),
        };
      }

      useProjectStore.getState().saveProject(next);
      set({ data: buildDashboardView(next) });
      showSuccess(
        type === "account"
          ? "Conta excluída."
          : type === "transaction"
            ? "Transação excluída."
            : "Orçamento excluído.",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao excluir.";
      showError(message);
      throw error;
    }
  },
}));
