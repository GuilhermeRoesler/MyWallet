const STORAGE_KEY = "my-wallet:projects";

export function loadFromStorage<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("Failed to read projects from localStorage", error);
    localStorage.removeItem(STORAGE_KEY);
    return fallback;
  }
}

export function saveToStorage<T>(value: T): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function createId(): string {
  return crypto.randomUUID();
}
