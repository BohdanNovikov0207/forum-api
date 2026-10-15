import type { Category } from "../domain/category/entity.js"

type Database = typeof import("../prisma/db.ts").db

export function createCategoryRepository(database: Database) {
  async function getAllCategories(): Promise<Category[]> {
    return await database.orm.public.Category.orderBy((c: any) => c.id.asc()).all()
  }

  async function getCategoryById(id: number): Promise<Category | null> {
    return await database.orm.public.Category.where({ id }).first()
  }

  async function createCategory(name: string): Promise<Category> {
    return await database.orm.public.Category.create({ name })
  }

  return { getAllCategories, getCategoryById, createCategory }
}