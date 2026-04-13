import React, { useEffect, useMemo, useRef, useState } from "react";
import { formatCompact } from "../lib/time";

export default function MemoEditor({ memo, onChange, onDelete, onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const lastLoadedIdRef = useRef(null);

  useEffect(() => {
    if (!memo) {
      lastLoadedIdRef.current = null;
      setTitle("");
      setContent("");
      return;
    }
    if (lastLoadedIdRef.current === memo.id) return;
    lastLoadedIdRef.current = memo.id;
    setTitle(memo.title ?? "");
    setContent(memo.content ?? "");
  }, [memo]);

  const meta = useMemo(() => {
    if (!memo) return "";
    const c = formatCompact(memo.createdAt);
    const u = formatCompact(memo.updatedAt);
    if (!c && !u) return "";
    if (c === u) return `created ${c}`;
    return `updated ${u} · created ${c}`;
  }, [memo]);

  useEffect(() => {
    if (!memo) return;
    if (title === (memo.title ?? "") && content === (memo.content ?? "")) return;
    const t = setTimeout(() => {
      onChange({ title, content });
    }, 250);
    return () => clearTimeout(t);
  }, [title, content, memo, onChange]);

  if (!memo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
        <div className="text-sm text-white/70">선택된 메모가 없습니다.</div>
        <button
          className="rounded-xl bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-400 active:bg-blue-600"
          onClick={onCreate}
          type="button"
        >
          + 새 메모
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-xs text-white/50">{meta}</div>
        <button
          className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/15"
          onClick={onDelete}
          type="button"
        >
          삭제
        </button>
      </div>

      <div className="mb-3">
        <label className="mb-1.5 block text-xs font-semibold text-white/70">제목</label>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/40"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력…"
        />
      </div>

      <div className="mb-0">
        <label className="mb-1.5 block text-xs font-semibold text-white/70">내용</label>
        <textarea
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력…"
          rows={10}
        />
      </div>
    </div>
  );
}

