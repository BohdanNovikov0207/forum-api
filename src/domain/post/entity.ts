import type { Category } from "../category/entity.js"
import type { User } from "../user/entity.js"

export interface Post {
  id: number
  title: string
  content: string
  authorId: number
  author: User
  categoryId: number
  category: Category
}