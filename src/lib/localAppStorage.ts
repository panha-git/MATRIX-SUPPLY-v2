export const STORAGE_PREFIX = "matrix-supply-cambodia:";
export const PLATFORM_CHANGED_EVENT = "matrix-supply-cambodia:changed";

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + key) || "") as T; }
  catch { return fallback; }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new Event(PLATFORM_CHANGED_EVENT));
}

export function makeId(prefix: string) {
  return `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

export function resetLocalAppStorage() {
  if (typeof window === "undefined") return;
  Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX) || k.startsWith("matrix-supply-v2:")).forEach(k => localStorage.removeItem(k));
  sessionStorage.clear();
  window.dispatchEvent(new Event(PLATFORM_CHANGED_EVENT));
}
