import type {
	CommentService,
	CommentServiceDependencies,
} from "./comment.types.js";

function validateAndTrimContent(content: unknown): string {
	if (typeof content !== "string") {
		throw new Error("INVALID_CONTENT");
	}

	const trimmed = content.trim();
	if (trimmed.length < 1 || trimmed.length > 500) {
		throw new Error("INVALID_CONTENT");
	}

	return trimmed;
}

export function createCommentService({
	comments,
	posts,
}: CommentServiceDependencies): CommentService {
	async function ensurePostExists(postId: number): Promise<void> {
		const post = await posts.getPostById(postId);
		if (!post) {
			throw new Error("POST_NOT_FOUND");
		}
	}

	async function getPostComments(postId: number) {
		await ensurePostExists(postId);
		return await comments.findCommentByPostId(postId);
	}

	async function createComment({
		postId,
		authorId,
		content,
	}: {
		postId: number;
		authorId: number;
		content: unknown;
	}) {
		await ensurePostExists(postId);
		const validContent = validateAndTrimContent(content);

		return await comments.createComment({
			postId,
			authorId,
			content: validContent,
		});
	}

	async function deleteComment({
		commentId,
		userId,
	}: {
		commentId: number;
		userId: number;
	}): Promise<void> {
		const existing = await comments.findCommentById(commentId);
		if (!existing) {
			throw new Error("COMMENT_NOT_FOUND");
		}

		if (existing.authorId !== userId) {
			throw new Error("FORBIDDEN");
		}

		await comments.deleteCommentById(commentId);
	}

	return {
		getPostComments,
		createComment,
		deleteComment,
	};
}