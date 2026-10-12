import type { Post } from "../domain/post/entity.js"

export interface CreatePostInput {
  id: number
  title: string
  content: string
  author: string
  category: string
}

export interface PostService {
  getAllPosts(take?: number, category?: string): Promise<Post[]>
  getPostById(id: number): Promise<Post | undefined>
  createPost(newPostData: CreatePostInput): Promise<Post>
}