import type { Post } from "../../../src/domain/post/entity.js"

interface PostCardProps {
  post: Post
}

export function PostCard(props: PostCardProps) {
  const { post } = props
  return (
    <div className="post-card">
      <div>
        <span className="post-category">{post.category}</span>
        <span className="post-author">{post.author}</span>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>
    </div>
  )
}