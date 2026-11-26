import type { RequestHandler } from "express";
import { Router } from "express";
import type { PostHandler } from "../transport/handler/post.types.js";

export function createPostRouter(
	handler: PostHandler,
	requireAuth: RequestHandler,
) {
	const postRouter = Router();

	postRouter.get("/", requireAuth, handler.getPostsHandler);
	postRouter.get("/:id", handler.getPostByIdHandler);
	postRouter.post("/create", requireAuth, handler.createPostHandler);

	return postRouter;
}