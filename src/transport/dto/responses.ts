import type { Category } from "../../domain/category/entity.js"
import type { User } from "../../domain/user/entity.js"

export interface PostResponse{
    id: number
    title: string
    content: string
    author: User
    categoryId: number
    category?: Category
}