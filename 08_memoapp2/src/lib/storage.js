const STORAGE_KEY = "memoapp2:memos:v1";

export function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveMemos(memos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

