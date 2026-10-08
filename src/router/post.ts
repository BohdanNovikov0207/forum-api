import { Router } from 'express';
import type { PostHandler } from '../transport/handler/post.types.js';

export function createPostRouter(handler: PostHandler){
    const postRouter = Router()

    postRouter.get('/posts', handler.getPostsHandler);
    postRouter.get('/posts/:id', handler.getPostByIdHandler);
    postRouter.post('/posts/create', handler.createPostHandler);

    return postRouter
}