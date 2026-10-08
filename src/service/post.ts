import type { PostRepository } from '../domain/post/repository.js'
import { createPostRepository } from '../repository/post.js'
import type { CreatePostInput } from './post.types.js'

export function createPostService(repository: PostRepository){
  function getAllPosts(take?: number, category?: string) {
    return repository.getAll(take, category)
  }
  
  function getPostById(id: number) {
    return repository.getPostById(id)
  }   
  
  function createPost(postData: CreatePostInput) {
    return repository.createPost(postData)
  }
  return {getAllPosts, getPostById, createPost}
}