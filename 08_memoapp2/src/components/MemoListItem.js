import React, { useMemo } from "react";
import { formatCompact } from "../lib/time";

function pickTitle(memo) {
  const t = String(memo.title ?? "").trim();
  if (t) return t;
  const c = String(memo.content ?? "").trim();
  if (!c) return "(빈 메모)";
  return c.split("\n")[0].slice(0, 40);
}

export default function MemoListItem({ memo, active, onSelect, onTogglePin }) {
  const title = useMemo(() => pickTitle(memo), [memo]);
  const preview = useMemo(() => String(memo.content ?? "").trim(), [memo]);
  const meta = useMemo(() => formatCompact(memo.updatedAt || memo.createdAt), [memo]);

  return (
    <div
      className={[
        "group rounded-xl border px-3 py-3 transition",
        "border-white/10 bg-white/5 hover:bg-white/10",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        active ? "bg-white/10 ring-1 ring-blue-400/30" : ""
      ].join(" ")}
      role="listitem"
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      aria-current={active ? "true" : "false"}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {memo.pinned ? (
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/20">
                PIN
              </span>
            ) : null}
            <div className="truncate text-sm font-semibold text-white">{title}</div>
          </div>
          {preview ? (
            <div className="mt-1 line-clamp-2 text-sm text-white/60">
              {preview}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 text-xs text-white/50">{meta}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-white/50">
          id: <span className="font-mono text-white/70">{memo.id.slice(0, 8)}</span>
        </div>
        <button
          className={[
            "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
            memo.pinned
              ? "border border-amber-400/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15"
              : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
          ].join(" ")}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          aria-label={memo.pinned ? "고정 해제" : "고정"}
          title={memo.pinned ? "고정 해제" : "고정"}
          type="button"
        >
          {memo.pinned ? "Unpin" : "Pin"}
        </button>
      </div>
    </div>
  );
}

