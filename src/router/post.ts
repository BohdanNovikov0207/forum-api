import type { RequestHandler } from "express";
import { Router } from "express";
import type { PostHandler } from "../transport/handler/post.types.js";
import { createRequireAuth } from "../transport/middlewares/require-auth";

export function createPostRouter(
	handler: PostHandler,
	requireAuth: RequestHandler,
) {
	const postRouter = Router();

	postRouter.get("/posts", requireAuth, handler.getPostsHandler);
	postRouter.get("/posts/:id", handler.getPostByIdHandler);
	postRouter.post("/posts/create", handler.createPostHandler);

	return postRouter;
}
