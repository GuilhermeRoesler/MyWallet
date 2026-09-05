import { useCallback, useState } from "react";

const STORAGE_KEY = "my-wallet:sidebar-open";

function readStored(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return true;
    return raw === "1";
  } catch {
    return true;
  }
}

function writeStored(open: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
}

/** Preferência de sidebar aberta no desktop (persistida em localStorage). */
export function useSidebarOpen() {
  const [open, setOpen] = useState(readStored);

  const setSidebarOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setOpen((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        writeStored(value);
        return value;
      });
    },
    [],
  );

  return [open, setSidebarOpen] as const;
}
