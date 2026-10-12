import type { Post } from "../../../src/domain/post/entity.js"
import { PostCard } from "./PostCard.tsx"

interface PostListProps {
  posts: Post[]
}

export function PostList(props: PostListProps) {
  const { posts } = props
  return (
    <div className="post-list">
      {posts.map((post) => {
        return (
          <PostCard key={post.id} post={post} />
        )
      })}
    </div>
  )
}