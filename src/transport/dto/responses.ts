import type { Category } from "../../domain/category/entity.js"

export interface PostResponse{
    id: number
    title: string
    content: string
    author: string
    categoryId: number
    category?: Category
}