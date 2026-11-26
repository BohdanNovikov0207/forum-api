import type { UserRepository } from "../domain/user/repository.js";
import type { Database } from "../prisma/db.js";

export function createUserRepository(database: Database): UserRepository {
	return {
		async createUser(data) {
			try {
				return await database.orm.public.user.create(data);
			} catch (error) {
				if (
					error instanceof Error &&
					"sqlState" in error &&
					error.sqlState === "23505"
				) {
					throw new Error("Email already exists");
				}
				throw error;
			}
		},
		async getByEmail(email) {
			return await database.orm.public.user.where({ email }).first();
		},
		async getById(id) {
			return await database.orm.public.user.where({ id }).first();
		},
	};
}
