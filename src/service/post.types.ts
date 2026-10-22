import type { Category } from "../domain/category/entity.js"
import type { Post } from "../domain/post/entity.js"

export interface CreatePostInput {
  title: string
  content: string
  authorId: number
  category: string
}

export type PostWithCategory = Post & { category: Category};

export interface PostService {
  getAllPosts: (take?: number, category?: string) => Promise<PostWithCategory[]>
  getPostById: (id: number) => Promise<PostWithCategory | null>
  createPost: (postData: CreatePostInput) => Promise<Post>
}