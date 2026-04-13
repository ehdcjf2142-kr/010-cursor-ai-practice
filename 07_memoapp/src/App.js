import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import './App.css';

const STORAGE_KEY = 'memo-app-data-v2';

const DEFAULT_W = 280;
const DEFAULT_H = 260;
const MIN_W = 200;
const MIN_H = 160;

function normalizeMemo(m, index) {
  const stagger = (index % 12) * 24;
  return {
    ...m,
    x: typeof m.x === 'number' ? m.x : 20 + stagger,
    y: typeof m.y === 'number' ? m.y : 20 + stagger,
    width: typeof m.width === 'number' ? m.width : DEFAULT_W,
    height: typeof m.height === 'number' ? m.height : DEFAULT_H,
    z: typeof m.z === 'number' ? m.z : index + 1,
  };
}

function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((m, i) => normalizeMemo(m, i));
  } catch {
    return [];
  }
}

function createMemo(index) {
  const stagger = (index % 12) * 24;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    content: '',
    x: 20 + stagger,
    y: 20 + stagger,
    width: DEFAULT_W,
    height: DEFAULT_H,
    z: index + 1,
  };
}

function App() {
  const [memos, setMemos] = useState(loadMemos);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const editingTextareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  const bringToFront = useCallback(
    (id) => {
      setMemos((prev) => {
        const nextMax = prev.reduce((n, m) => Math.max(n, m.z || 0), 0) + 1;
        return prev.map((m) => (m.id === id ? { ...m, z: nextMax } : m));
      });
    },
    []
  );

  const filteredMemos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return memos;
    return memos.filter((m) => m.content.toLowerCase().includes(q));
  }, [memos, searchQuery]);

  const boardMinHeight = useMemo(() => {
    let bottom = 0;
    for (const m of memos) {
      const b = (m.y || 0) + (m.height || DEFAULT_H);
      if (b > bottom) bottom = b;
    }
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    /* 가장 아래 메모 아래에 넉넉한 작업 여백 (화면 높이의 절반 이상, 최소 420px) */
    const belowPad = Math.max(420, Math.round(vh * 0.55));
    const minFromContent = bottom + belowPad;
    const minViewport = vh - 100;
    return Math.max(minFromContent, minViewport, 520);
  }, [memos]);

  const handleNewMemoClick = () => {
    const memo = createMemo(memos.length);
    setMemos((prev) => {
      const z = prev.reduce((n, m) => Math.max(n, m.z || 0), 0) + 1;
      return [{ ...memo, z }, ...prev];
    });
    setEditingId(memo.id);
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
    setEditingId((current) => (current === id ? null : current));
  };

  const handleContentChange = (id, value) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: value } : m))
    );
  };

  useEffect(() => {
    if (editingId && editingTextareaRef.current) {
      editingTextareaRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">메모 앱</h1>
        <div className="toolbar">
          <button type="button" className="btn btn-primary" onClick={handleNewMemoClick}>
            새 메모
          </button>
          <label className="search-wrap">
            <span className="search-label">메모 검색</span>
            <input
              type="search"
              className="search-input"
              placeholder="내용으로 검색…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="메모 검색"
            />
          </label>
        </div>
        <p className="board-hint">
          상단 줄을 잡고 끌면 이동, 모서리를 잡으면 크기를 조절할 수 있어요.
        </p>
      </header>

      <main className="memo-board" style={{ minHeight: boardMinHeight }}>
        {filteredMemos.length === 0 ? (
          <p className="empty-hint">
            {memos.length === 0
              ? '「새 메모」로 첫 메모를 만들어 보세요.'
              : '검색 결과가 없습니다.'}
          </p>
        ) : (
          filteredMemos.map((memo) => {
            const isEditing = editingId === memo.id;
            return (
              <Rnd
                key={memo.id}
                className="memo-rnd"
                style={{ zIndex: memo.z || 1 }}
                size={{ width: memo.width, height: memo.height }}
                position={{ x: memo.x, y: memo.y }}
                minWidth={MIN_W}
                minHeight={MIN_H}
                bounds="parent"
                dragHandleClassName="memo-drag-handle"
                onDragStart={() => bringToFront(memo.id)}
                onDragStop={(e, d) => {
                  setMemos((prev) =>
                    prev.map((m) =>
                      m.id === memo.id ? { ...m, x: d.x, y: d.y } : m
                    )
                  );
                }}
                onResizeStart={() => bringToFront(memo.id)}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setMemos((prev) =>
                    prev.map((m) =>
                      m.id === memo.id
                        ? {
                            ...m,
                            width: parseInt(ref.style.width, 10),
                            height: parseInt(ref.style.height, 10),
                            x: position.x,
                            y: position.y,
                          }
                        : m
                    )
                  );
                }}
              >
                <div
                  className={`memo-card ${isEditing ? 'memo-card--editing' : ''}`}
                  role="article"
                >
                  <div
                    className="memo-drag-handle"
                    title="이동"
                    aria-label="메모를 끌어 이동"
                  >
                    <span className="memo-drag-grip" aria-hidden />
                    이동 · 크기는 모서리
                  </div>
                  {isEditing ? (
                    <>
                      <textarea
                        ref={editingTextareaRef}
                        className="memo-textarea"
                        value={memo.content}
                        onChange={(e) => handleContentChange(memo.id, e.target.value)}
                        placeholder="메모를 입력하세요…"
                        aria-label="메모 내용 편집"
                      />
                      <div className="memo-actions">
                        <button
                          type="button"
                          className="btn btn-save"
                          onClick={handleSave}
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(memo.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="memo-body">
                        {memo.content.trim() ? (
                          memo.content
                        ) : (
                          <span className="memo-placeholder">
                            내용이 비어 있습니다. 수정을 눌러 입력하세요.
                          </span>
                        )}
                      </div>
                      <div className="memo-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleEdit(memo.id)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(memo.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </Rnd>
            );
          })
        )}
      </main>
    </div>
  );
}

export default App;
