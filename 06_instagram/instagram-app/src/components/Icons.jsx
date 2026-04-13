export function IconHome({ active }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {active ? (
        <path
          fill="currentColor"
          d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"
        />
      ) : (
        <path d="M3 10.5L12 3l9 7.5M5 10v10h5v-6h4v6h5V10" />
      )}
    </svg>
  )
}

export function IconSearch() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconReels() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M17 9l4-2v10l-4-2V9z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconHeart({ filled }) {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24">
      {filled ? (
        <path
          fill="#ed4956"
          stroke="#ed4956"
          strokeWidth="1"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      )}
    </svg>
  )
}

export function IconComment() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12c0 4.97-4.03 9-9 9H6l-4 3V12c0-4.97 4.03-9 9-9s9 4.03 9 9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconShare() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 3L9 10l6 2 7-9zM9 10v9l3-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconBookmark({ filled }) {
  return (
    <svg aria-hidden width="22" height="26" viewBox="0 0 24 24">
      {filled ? (
        <path
          fill="currentColor"
          d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"
        />
      )}
    </svg>
  )
}

export function IconMore() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  )
}

export function IconHeartNav({ active }) {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}>
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  )
}

export function IconMessenger() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
