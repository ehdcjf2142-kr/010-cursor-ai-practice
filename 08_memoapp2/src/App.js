import React, { useEffect, useMemo, useState } from "react";
import MemoEditor from "./components/MemoEditor";
import MemoList from "./components/MemoList";
import { loadMemos, saveMemos } from "./lib/storage";
import { uid } from "./lib/uid";

function normalizeText(s) {
  return String(s ?? "").trim();
}

function makeNewMemo() {
  const now = new Date().toISOString();
  return {
    id: uid(),
    title: "",
    content: "",
    pinned: false,
    createdAt: now,
    updatedAt: now
  };
}

export default function App() {
  const [memos, setMemos] = useState(() => loadMemos());
  const [activeId, setActiveId] = useState(() => {
    const initial = loadMemos();
    return initial[0]?.id ?? null;
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    saveMemos(memos);
  }, [memos]);

  useEffect(() => {
    if (activeId && memos.some((m) => m.id === activeId)) return;
    setActiveId(memos[0]?.id ?? null);
  }, [memos, activeId]);

  const filtered = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const base = q
      ? memos.filter((m) => {
          const t = `${m.title}\n${m.content}`.toLowerCase();
          return t.includes(q);
        })
      : memos;

    const pinned = base
      .filter((m) => m.pinned)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const normal = base
      .filter((m) => !m.pinned)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return [...pinned, ...normal];
  }, [memos, query]);

  const activeMemo = useMemo(() => memos.find((m) => m.id === activeId) ?? null, [memos, activeId]);

  function createMemo() {
    const next = makeNewMemo();
    setMemos((prev) => [next, ...prev]);
    setActiveId(next.id);
  }

  function updateMemo(patch) {
    if (!activeId) return;
    const now = new Date().toISOString();
    setMemos((prev) =>
      prev.map((m) => (m.id === activeId ? { ...m, ...patch, updatedAt: now } : m))
    );
  }

  function deleteActive() {
    if (!activeId) return;
    setMemos((prev) => prev.filter((m) => m.id !== activeId));
  }

  function togglePin(id) {
    const now = new Date().toISOString();
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned, updatedAt: now } : m))
    );
  }

  return (
    <div className="app-bg">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-200 ring-1 ring-blue-400/20">
                Memo
              </span>
              <h1 className="text-xl font-semibold tracking-tight text-white">Memo App 2</h1>
            </div>
            <p className="mt-1 text-sm text-white/60">localStorage · autosave · pin · search</p>
          </div>

          <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur md:w-auto">
            <div className="px-2 text-xs font-semibold text-white/60">검색</div>
            <input
              className="w-full bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/40 md:w-80"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목/내용 검색…"
              aria-label="메모 검색"
            />
            <button
              className="shrink-0 rounded-xl bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-400 active:bg-blue-600"
              onClick={createMemo}
              type="button"
            >
              + 새 메모
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                <div className="text-sm font-semibold text-white">
                  목록 <span className="text-white/50">({filtered.length})</span>
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
                  pinned 우선
                </span>
              </div>
              <div className="p-4">
                <div className="mb-3 text-sm text-white/60">새 메모는 자동 저장됩니다.</div>
                <MemoList
                  memos={filtered}
                  activeId={activeId}
                  onSelect={setActiveId}
                  onTogglePin={togglePin}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white">
                편집
              </div>
              <div className="p-4">
                <MemoEditor
                  memo={activeMemo}
                  onChange={updateMemo}
                  onDelete={deleteActive}
                  onCreate={createMemo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

