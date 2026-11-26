import type { Request, Response } from "express";
import type { ErrorResponse } from "../dto/errors.js";
import type { PostResponse } from "../dto/responses.js";

export interface PostHandler {
	getPostsHandler: (
		req: Request,
		res: Response<PostResponse[] | ErrorResponse>,
	) => Promise<void>;
	getPostByIdHandler: (
		req: Request,
		res: Response<PostResponse | ErrorResponse>,
	) => Promise<void>;
	createPostHandler: (
		req: Request,
		res: Response<PostResponse | ErrorResponse>,
	) => Promise<void>;
}
