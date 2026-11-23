import type { RefreshRepository } from "../domain/refresh-session/repository.js";
import type { Database } from "../prisma/db.js";

export function createRefreshSessionRepository(
	database: Database,
): RefreshRepository {
	return {
		async getByHash(hash) {
			const session = await database.orm.public.RefreshSession.where({
				tokenHash: hash,
			}).first();

			if (!session) return null;

			return {
				...session,
				expiresAt: new Date(session.expiresAt.epochMilliseconds),
				createdAt: new Date(session.createdAt.epochMilliseconds),
			};
		},

		async create(data) {
			await database.orm.public.RefreshSession.create({
				...data,
				expiresAt: Temporal.Instant.fromEpochMilliseconds(
					data.expiresAt.getTime(),
				),
			});
		},

		async rotate(oldHash, newHash, expiresAt) {
			const updated = await database.orm.public.RefreshSession.where({
				tokenHash: oldHash,
			}).update({
				tokenHash: newHash,
				expiresAt: Temporal.Instant.fromEpochMilliseconds(expiresAt.getTime()),
			});

			return updated !== null;
		},

		async deleteByHash(hash) {
			await database.orm.public.RefreshSession.where({
				tokenHash: hash,
			}).delete();
		},
	};
}
