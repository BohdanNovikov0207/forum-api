import { type RequestHandler, Router } from "express";
import type { CommentHandler } from "../transport/handler/comment.types.js";

export function createCommentRouter(
	handlers: CommentHandler,
	requireAuth: RequestHandler,
): Router {
	const router = Router();

	router.get("/posts/:postId/comments", handlers.getByPostHandler);
	router.post(
		"/posts/:postId/comments",
		requireAuth,
		handlers.createCommentHandler,
	);
	router.delete(
		"/comments/:commentId",
		requireAuth,
		handlers.deleteCommentHandler,
	);

	return router;
}