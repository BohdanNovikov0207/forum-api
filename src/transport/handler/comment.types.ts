import type { Request, Response } from "express";
import type { CommentWithAuthor } from "../../domain/comment/entity.js";
import type { ErrorResponse } from "../dto/errors.js";

export interface CommentHandler {
	getByPostHandler: (
		req: Request,
		res: Response<CommentWithAuthor[] | ErrorResponse>,
	) => Promise<void>;
	createCommentHandler: (
		req: Request,
		res: Response<CommentWithAuthor | ErrorResponse>,
	) => Promise<void>;
	deleteCommentHandler: (
		req: Request,
		res: Response<void | ErrorResponse>,
	) => Promise<void>;
}