import type { Request, Response } from "express";
import type { PostResponse } from "../dto/responses.js";
import type { ErrorResponse } from "../dto/errors.js";

export interface PostHandler{
    getPostsHandler: (
        req: Request,
        res: Response<PostResponse[] | ErrorResponse>
    ) => Promise<void>;
    getPostByIdHandler: (
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ) => Promise<void>;
    createPostHandler: (
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ) => Promise<void>;

}