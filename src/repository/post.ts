import { isStructuredError } from "@prisma/orm-postgres/utils"
import type { Post } from "../domain/post/entity.js"
import type { CreatePostInput, PostWithCategory } from "../service/post.types.js"

type Database = typeof import("../prisma/db.ts").db

export function createPostRepository(database: Database) {
  async function getAllPosts(take?: number, categoryName?: string): Promise<PostWithCategory[]> {
    let categoryId: number | undefined = undefined

    if (categoryName) {
      const category = await database.orm.public.Category
        .where({ name: categoryName })
        .first()
      
      if (category) {
        categoryId = category.id
      } else {
        return []
      }
    }

    let query = database.orm.public.Post.include("category").include("author").orderBy((p: any) => p.id.asc())

    if (categoryId !== undefined) {
      query = database.orm.public.Post
        .where({ categoryId })
        .include("category")
        .include("author")
        .orderBy((p: any) => p.id.asc())
    }

    if (!take) {
      return await query.all()
    }
    return await query.limit(take).all()
  }

  async function getPostById(id: number): Promise<PostWithCategory | null> {
    return await database.orm.public.Post.where({ id }).include("category").include("author").first()
  }

  async function createPost(postData: { title: string; content: string; authorId: number; category: string }): Promise<Post> {
    try {
      const { category: categoryName, ...fields } = postData

      let category = await database.orm.public.Category
        .where({ name: categoryName })
        .first()

      if (!category) {
        category = await database.orm.public.Category.create({ name: categoryName })
      }

      const post = await database.orm.public.Post.create({
        ...fields,
        categoryId: category.id
      })

      return await database.orm.public.Post.where({ id: post.id }).include("category").include("author").first() as Post
    } catch (error) {
      if (error instanceof Error && "sqlState" in error && error.sqlState === "23505") {
        throw new Error("POST_ALREADY_EXISTS")
      }
      throw error
    }
  }

  return { getAllPosts, getPostById, createPost }
}