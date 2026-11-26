import type { Category } from "../domain/category/entity.js";
import type { Database } from "../prisma/db.js";

export function createCategoryRepository(database: Database) {
	async function getAllCategories(): Promise<Category[]> {
		return await database.orm.public.category.orderBy((c: any) =>
			c.id.asc(),
		).all();
	}

	async function getCategoryById(id: number): Promise<Category | null> {
		return await database.orm.public.category.where({ id }).first();
	}

	async function createCategory(name: string): Promise<Category> {
		return await database.orm.public.category.create({ name });
	}

	return { getAllCategories, getCategoryById, createCategory };
}
