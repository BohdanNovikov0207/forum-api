import type { Post } from "../domain/post/entity.ts";

export interface CreatePostInput{
    id: number,
    title: string,
    content: string,
    author: string,
    category: string
}

export interface PostService{
    getAllPosts: (take?: number, category?: string) => Post[],
    createPost: (postData: CreatePostInput) => Promise<Post>,
    getPostById: (id: number) => Post | undefined
}