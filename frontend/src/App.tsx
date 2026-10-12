import './App.css'
import { Header } from './components/Header.tsx'
import { PostList } from './components/PostList.tsx'
import { postsList } from './data/posts.ts'

function App() {
  return (
    <div className="app-container">
      <Header title="App title" />
      <main className="main-content">
        <PostList posts={postsList} />
      </main>
    </div>
  )
}

export default App