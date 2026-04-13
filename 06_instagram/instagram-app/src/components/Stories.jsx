import { STORY_USERS } from '../data/feedData'

export function Stories() {
  return (
    <section className="ig-stories" aria-label="스토리">
      <div className="ig-stories-track">
        {STORY_USERS.map((s) => (
          <button
            key={s.name}
            type="button"
            className={`ig-story ${s.isAdd ? 'ig-story--add' : ''}`}
          >
            <span className="ig-story-ring">
              <img src={s.avatar} alt="" className="ig-story-avatar" width="56" height="56" />
            </span>
            <span className="ig-story-name">{s.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
