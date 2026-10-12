import type { Post } from "./entity.ts"
import type { CreatePostInput } from "../../service/post.types.js"

export interface PostRepository{
    getPostById(id: number): Promise<Post | undefined>
    getAll(take?: number, category?: string): Promise<Post[]>
    createPost(newPostData: CreatePostInput): Promise<Post>
}