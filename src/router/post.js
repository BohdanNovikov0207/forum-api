import { Router } from 'express';
import {
    getPostByIdHandler,
    getPostsHandler,
    createPostHandler
} from '../handler/post.js';

export const postRouter = Router()

postRouter.get('/posts', getPostsHandler);
postRouter.get('/posts/:id', getPostByIdHandler);
postRouter.post('/posts/create', createPostHandler);