import React from "react";
import MemoListItem from "./MemoListItem";

export default function MemoList({ memos, activeId, onSelect, onTogglePin }) {
  if (!memos.length) {
    return (
      <div
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70"
        role="alert"
      >
        메모가 없습니다. 상단의 <span className="font-semibold text-white">+ 새 메모</span> 버튼으로
        시작해보세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" role="list">
      {memos.map((memo) => (
        <MemoListItem
          key={memo.id}
          memo={memo}
          active={memo.id === activeId}
          onSelect={() => onSelect(memo.id)}
          onTogglePin={() => onTogglePin(memo.id)}
        />
      ))}
    </div>
  );
}

