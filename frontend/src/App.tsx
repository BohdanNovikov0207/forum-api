import './App.css'
import { Header } from './components/Header.tsx'
import { useGetAllPostsQuery } from './api/baseApi.ts'

function App() {
  const { data: posts = [], isLoading, isError } = useGetAllPostsQuery();

  return (
    <div className="app-container">
      <Header title="App title" />

      { isLoading && 
        <h1>Загрузка</h1>
      }
      { isError && 
        <h1>Ошибка</h1>
      }
      {posts.length === 0 && 
        <p>Постов нет</p>
      }
      {!isLoading && !isError && posts.length > 0 && (
        <div className="post-card">
          {posts.map((post) => (
            <div key={post.id}>
              <div>
                <span>{post.category?.name}</span>
                <span>{post.author?.email}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App