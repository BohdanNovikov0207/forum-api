import type { Request, Response } from "express"
import type { Category } from "../../domain/category/entity.js"
import type { ErrorResponse } from "../dto/errors.js"

export function createCategoryHandler(service: any) {
  async function getCategoriesHandler(req: Request, res: Response) {
    try {
      const categories = await service.getCategories()
      res.status(200).json(categories)
    } catch (error: any) {
      res.status(500).json({ ok: false, description: error.message || "Internal server error" })
    }
  }

  async function getCategoryByIdHandler(req: Request, res: Response) {
    const { id } = req.params
    const categoryId = Number(id)

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      res.status(400).json({ ok: false, description: "id must be a positive integer" })
      return
    }

    try {
      const category = await service.getCategoryById(categoryId)
      if (!category) {
        res.status(404).json({ ok: false, description: "Category not found" })
        return
      }
      res.status(200).json(category)
    } catch (error: any) {
      res.status(500).json({ ok: false, description: error.message || "Internal server error" })
    }
  }

  async function createCategoryHandler(req: Request, res: Response) {
    const { name } = req.body

    if (typeof name !== "string" || !name.trim()) {
      res.status(422).json({ ok: false, description: "Validation error: name is required" })
      return
    }

    try {
      const newCategory = await service.createCategory(name.trim())
      res.status(201).json(newCategory)
    } catch (error: any) {
      if (error.message === "CATEGORY_ALREADY_EXISTS") {
        res.status(409).json({ ok: false, description: "Category already exists" })
        return
      }
      res.status(500).json({ ok: false, description: error.message || "Internal server error" })
    }
  }

  return { getCategoriesHandler, getCategoryByIdHandler, createCategoryHandler }
}