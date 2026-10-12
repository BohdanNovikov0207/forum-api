import type { PostRepository } from "../domain/post/repository.js"
import type { CreatePostInput, PostService } from "./post.types.js"

export function createPostService(repository: PostRepository): PostService {
  function getAllPosts(take?: number, category?: string) {
    return repository.getAll(take, category)
  }

  function getPostById(id: number) {
    return repository.getPostById(id)
  }

  function createPost(newPostData: CreatePostInput) {
    return repository.createPost(newPostData)
  }

  return { getAllPosts, getPostById, createPost }
}