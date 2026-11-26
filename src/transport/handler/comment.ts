import type { Request, Response } from "express";
import type { CommentWithAuthor } from "../../domain/comment/entity.js";
import type { CommentService } from "../../service/comment/comment.types.js";
import type { ErrorResponse } from "../dto/errors.js";
import type { CommentHandler } from "./comment.types.js";

function parsePositiveId(raw: unknown): number | null {
	if (typeof raw !== "string") {
		return null;
	}
	const parsed = parseInt(raw, 10);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		return null;
	}
	return parsed;
}

export function createCommentHandler(service: CommentService): CommentHandler {
	async function getByPostHandler(
		req: Request,
		res: Response<CommentWithAuthor[] | ErrorResponse>,
	) {
		const postId = parsePositiveId(req.params.postId);
		if (!postId) {
			res
				.status(400)
				.json({ ok: false, description: "postId must be a positive integer" });
			return;
		}

		try {
			const comments = await service.getPostComments(postId);
			res.status(200).json(comments);
		} catch (error: any) {
			if (error?.message === "POST_NOT_FOUND") {
				res.status(404).json({ ok: false, description: "Post not found" });
				return;
			}
			res.status(500).json({
				ok: false,
				description: error?.message || "Internal server error",
			});
		}
	}

	async function createCommentHandler(
		req: Request,
		res: Response<CommentWithAuthor | ErrorResponse>,
	) {
		const postId = parsePositiveId(req.params.postId);
		if (!postId) {
			res
				.status(400)
				.json({ ok: false, description: "postId must be a positive integer" });
			return;
		}

		const authorId =
			typeof res.locals.userId === "number"
				? res.locals.userId
				: res.locals.userId?.authorId;

		if (typeof authorId !== "number" || !Number.isInteger(authorId) || authorId <= 0) {
			res.status(401).json({ ok: false, description: "Unauthorized" });
			return;
		}

		const { content } = req.body ?? {};
		if (typeof content !== "string" || !content.trim()) {
			res.status(422).json({
				ok: false,
				description: "Validation error: content is required",
			});
			return;
		}

		try {
			const created = await service.createComment({
				postId,
				authorId,
				content,
			});
			res.status(201).json(created);
		} catch (error: any) {
			if (error?.message === "POST_NOT_FOUND") {
				res.status(404).json({ ok: false, description: "Post not found" });
				return;
			}
			if (error?.message === "INVALID_CONTENT") {
				res.status(422).json({
					ok: false,
					description:
						"Validation error: content must be between 1 and 500 characters",
				});
				return;
			}
			res.status(500).json({
				ok: false,
				description: error?.message || "Internal server error",
			});
		}
	}

	async function deleteCommentHandler(
		req: Request,
		res: Response<void | ErrorResponse>,
	) {
		const commentId = parsePositiveId(req.params.commentId);
		if (!commentId) {
			res.status(400).json({
				ok: false,
				description: "commentId must be a positive integer",
			});
			return;
		}

		const userId =
			typeof res.locals.userId === "number"
				? res.locals.userId
				: res.locals.userId?.authorId;

		if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
			res.status(401).json({ ok: false, description: "Unauthorized" });
			return;
		}

		try {
			await service.deleteComment({ commentId, userId });
			res.status(204).send();
		} catch (error: any) {
			if (error?.message === "COMMENT_NOT_FOUND") {
				res.status(404).json({ ok: false, description: "Comment not found" });
				return;
			}
			if (error?.message === "FORBIDDEN") {
				res.status(403).json({
					ok: false,
					description: "Cannot delete another user's comment",
				});
				return;
			}
			res.status(500).json({
				ok: false,
				description: error?.message || "Internal server error",
			});
		}
	}

	return {
		getByPostHandler,
		createCommentHandler,
		deleteCommentHandler,
	};
}