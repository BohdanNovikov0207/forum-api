import { Router } from "express"

export function createCategoryRouter(handler: any) {
  const router = Router()

  router.get("/", handler.getCategoriesHandler)
  router.get("/:id", handler.getCategoryByIdHandler)
  router.post("/", handler.createCategoryHandler)

  return router
}