import type {
	Comment,
	CommentWithAuthor,
	CreateCommentInput,
} from "../domain/comment/entity.js";
import type { CommentRepository } from "../domain/comment/repository.js";
import type { Database } from "../prisma/db.js";

export function createCommentRepository(
	database: Database,
): CommentRepository {
	async function findCommentByPostId(
		postId: number,
	): Promise<CommentWithAuthor[]> {
		return await database.orm.public.comment
			.where({ postId })
			.include("author")
			.orderBy((c: any) => c.id.asc())
			.all();
	}

	async function findCommentById(commentId: number): Promise<Comment | null> {
		return await database.orm.public.comment
			.where({ id: commentId })
			.first();
	}

	async function createComment(
		data: CreateCommentInput,
	): Promise<CommentWithAuthor> {
		const created = await database.orm.public.comment.create(data);

		return (await database.orm.public.comment
			.where({ id: created.id })
			.include("author")
			.first()) as CommentWithAuthor;
	}

	async function deleteCommentById(commentId: number): Promise<void> {
		await database.orm.public.comment.where({ id: commentId }).delete();
	}

	return {
		findCommentByPostId,
		findCommentById,
		createComment,
		deleteCommentById,
	};
}