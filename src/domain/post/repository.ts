import type { Post } from "./entity.ts"

export interface PostRepository{
    getAll: (take?: number, category?: string) => Post[],
    createPost: (post: Post) => Promise<Post>,
    getPostById: (id: number) => Post | undefined
}