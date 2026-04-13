import { IconHeartNav, IconMessenger } from './Icons'

export function Header() {
  return (
    <header className="ig-header">
      <h1 className="ig-logo" lang="en">
        Instagram
      </h1>
      <div className="ig-header-actions">
        <button type="button" className="ig-icon-btn" aria-label="알림">
          <IconHeartNav />
        </button>
        <button type="button" className="ig-icon-btn" aria-label="메시지">
          <IconMessenger />
        </button>
      </div>
    </header>
  )
}
