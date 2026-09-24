import { getAll, getById, addPost } from '../repository/post.js'

export function getAllPosts(take, category) {
  return getAll(take, category)
}

export function getPostById(id) {
  return getById(id)
}

export function createPost(postData) {
  return addPost(postData)
}