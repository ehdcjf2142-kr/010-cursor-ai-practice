import { useState } from 'react'
import {
  IconBookmark,
  IconComment,
  IconHeart,
  IconMore,
  IconShare,
} from './Icons'

export function FeedPost({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeBump, setLikeBump] = useState(post.likes)

  function toggleLike() {
    setLiked((v) => {
      const next = !v
      setLikeBump((n) => (next ? n + 1 : n - 1))
      return next
    })
  }

  function onImageDoubleClick() {
    if (!liked) {
      setLiked(true)
      setLikeBump((n) => n + 1)
    }
  }

  return (
    <article className="ig-post">
      <header className="ig-post-header">
        <div className="ig-post-user">
          <img src={post.avatarSrc} alt="" className="ig-post-avatar" width="32" height="32" />
          <div className="ig-post-meta">
            <span className="ig-post-username">{post.username}</span>
          </div>
        </div>
        <button type="button" className="ig-icon-btn ig-post-more" aria-label="더보기">
          <IconMore />
        </button>
      </header>

      <div className="ig-post-media-wrap">
        <button
          type="button"
          className="ig-post-media-btn"
          onDoubleClick={onImageDoubleClick}
          aria-label="사진 더블탭으로 좋아요"
        >
          <img src={post.imageSrc} alt="" className="ig-post-image" loading="lazy" />
        </button>
      </div>

      <div className="ig-post-toolbar">
        <div className="ig-post-toolbar-left">
          <button type="button" className="ig-icon-btn" onClick={toggleLike} aria-pressed={liked} aria-label="좋아요">
            <IconHeart filled={liked} />
          </button>
          <button type="button" className="ig-icon-btn" aria-label="댓글">
            <IconComment />
          </button>
          <button type="button" className="ig-icon-btn" aria-label="공유">
            <IconShare />
          </button>
        </div>
        <button
          type="button"
          className="ig-icon-btn"
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
          aria-label="저장"
        >
          <IconBookmark filled={saved} />
        </button>
      </div>

      <div className="ig-post-body">
        <p className="ig-post-likes">좋아요 {likeBump.toLocaleString('ko-KR')}개</p>
        <p className="ig-post-caption">
          <strong>{post.username}</strong> {post.caption}
        </p>
        <p className="ig-post-time">{post.timeLabel}</p>
      </div>
    </article>
  )
}
