import { useState } from 'react'
import { IconHome, IconReels, IconSearch } from './Icons'

export function BottomNav() {
  const [tab, setTab] = useState('home')

  return (
    <nav className="ig-bottom-nav" aria-label="하단 메뉴">
      <button
        type="button"
        className={`ig-nav-item ${tab === 'home' ? 'active' : ''}`}
        onClick={() => setTab('home')}
        aria-current={tab === 'home' ? 'page' : undefined}
        aria-label="홈"
      >
        <IconHome active={tab === 'home'} />
      </button>
      <button type="button" className="ig-nav-item" aria-label="검색">
        <IconSearch />
      </button>
      <button type="button" className="ig-nav-item" aria-label="릴스">
        <IconReels />
      </button>
      <button
        type="button"
        className={`ig-nav-item ig-nav-profile ${tab === 'profile' ? 'active' : ''}`}
        onClick={() => setTab('profile')}
        aria-label="프로필"
      >
        <img src="/feed-images/man.png" alt="" width="26" height="26" className="ig-nav-avatar" />
      </button>
    </nav>
  )
}
