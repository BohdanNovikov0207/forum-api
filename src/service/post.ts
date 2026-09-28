import { getAll, getById, addPost } from '../repository/post.js'
import type { CreatePostRequest } from '../transport/dto/requests.js'

export function getAllPosts(take: string, category: string) {
  return getAll(take, category)
}

export function getPostById(id: number) {
  return getById(id)
}

export function createPost(postData: CreatePostRequest) {
  return addPost(postData)
}