import type { CreatePostInput } from "../service/post.types.js"
import type { Post } from "../domain/post/entity.js"

type Database = typeof import("../prisma/db.ts").db

export function createPostRepository(database: Database){
  async function getPostById(id: number): Promise<Post | undefined> {

    const post = await database.orm.public.Post.where({ id: id}).first()

    if (!post) return undefined

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      category: post.category
    }
  }


  async function getAll(take?: number, category?: string): Promise<Post[]>{
      let query = database.orm.public.Post.orderBy((post: any) => post.id.asc())

      if (category) {
      query = query.where({ category: category })
      }

      if (!take) {
      const posts = await query.all()
      return posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category
        }))
      }

      const posts = await query.limit(take).all()
      return posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category
      }))
  }

  async function createPost(newPostData: CreatePostInput): Promise<Post> {
      const post = await database.orm.public.Post.create({
        title: newPostData.title,
        content: newPostData.content,
        author: newPostData.author,
        category: newPostData.category
      })
    
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category
      }
    }
  return { getPostById, getAll, createPost }
}