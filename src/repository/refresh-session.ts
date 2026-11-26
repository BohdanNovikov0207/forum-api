import type { RefreshRepository } from "../domain/refresh-session/repository.js";
import type { Database } from "../prisma/db.js";

export function createRefreshSessionRepository(
	database: Database,
): RefreshRepository {
	return {
		async getByHash(hash) {
			const session = await database.orm.public.refreshSession
				.where({
					tokenHash: hash,
				})
				.first();

			if (!session){
				return null;
			}

			return {
				...session,
				expiresAt: new Date(session.expiresAt),
				createdAt: new Date(session.createdAt),
			};
		},

		async create(data) {
			await database.orm.public.refreshSession.create({
				...data,
			});
		},

		async rotate(oldHash, newHash, expiresAt) {
			const updated = await database.orm.public.refreshSession
				.where({
					tokenHash: oldHash,
				})
				.update({
					tokenHash: newHash,
					expiresAt,
				});

			return updated !== null;
		},

		async deleteByHash(hash) {
			await database.orm.public.refreshSession
				.where({
					tokenHash: hash,
				})
				.delete();
		},
	};
}