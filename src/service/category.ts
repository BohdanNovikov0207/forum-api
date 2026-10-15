import { isStructuredError } from "@prisma/orm-postgres/utils"

export function createCategoryService(repository: any) {
  async function getCategories() {
    return await repository.getAllCategories()
  }

  async function getCategoryById(id: number) {
    return await repository.getCategoryById(id)
  }

  async function createCategory(name: string) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("INVALID_CATEGORY_DATA")
    }
    try {
      return await repository.createCategory(name.trim())
    } catch (error) {
      if (error instanceof Error && "sqlState" in error) {
        if (error.sqlState === "23505" || error.sqlState === "23055") {
          throw new Error("CATEGORY_ALREADY_EXISTS")
        }
      }
      throw error
    }
  }

  return { getCategories, getCategoryById, createCategory }
}