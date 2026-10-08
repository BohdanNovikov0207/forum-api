import { getAllPosts, getPostById, createPost } from "../../service/post.js"
import type { Request, Response } from "express"
import type { CreatePostRequest } from "../dto/requests.js"
import type { ErrorResponse } from "../dto/errors.js"
import type { PostResponse } from "../dto/responses.js"

export function getPostsHandler(
    req: Request<{}, {}, CreatePostRequest>,
    res: Response<PostResponse | ErrorResponse>
) {
    const { take } = req.query
    const { category } = req.query

    if (take) {
        const takeNumber = parseInt(take, 10)
        if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
            res.status(400).json({ok: false, description: 'take must be a positive integer'})
            return
        }
    }

    const posts = getAllPosts(take, category)
    return res.status(200).json(posts)
}

export function getPostByIdHandler(
    req: Request<{}, {}, CreatePostRequest>,
    res: Response<PostResponse | ErrorResponse>
) {
    const { id } = req.params
    const postId = parseInt(id, 10)

    if (!Number.isInteger(postId) || postId < 0) {
        res.status(400).json({ok: false, description: 'id must be a positive integer'})
        return
    }

    const post = getPostById(postId)

    if (!post) {
        res.status(404).json({ok: false, description: 'post not found'})
        return
    }

    return res.status(200).json(post)
}

export async function createPostHandler(
    req: Request<{}, {}, CreatePostRequest>,
    res: Response<PostResponse | ErrorResponse>
) {
    const { title, content, author, category } = req.body

    if(typeof title !== "string" || typeof content !== "string" || !title.trim() || !content.trim()) {
        return res.status(422).json({ok: false, description: "Validation error"})
    }

    try{
        const newPost = await createPost({
            title: title,
            content: content,
            author: author,
            category: category
        })

        return res.status(201).json(newPost)
    } 
    catch(error){
        return res.status(500).json({ok: false, description: `${error.message}`})
    }
}