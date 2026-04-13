import { useMemo } from 'react'
import { BottomNav } from './components/BottomNav'
import { FeedPost } from './components/FeedPost'
import { Header } from './components/Header'
import { Stories } from './components/Stories'
import { buildPosts } from './data/feedData'
import './App.css'

function App() {
  const posts = useMemo(() => buildPosts(), [])

  return (
    <div className="ig-app">
      <Header />
      <main className="ig-main">
        <Stories />
        <div className="ig-feed">
          {posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
