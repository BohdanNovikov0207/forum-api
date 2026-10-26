import type { Request, Response } from "express"
import type { CreatePostRequest } from "../dto/requests.js"
import type { ErrorResponse } from "../dto/errors.js"
import type { PostResponse } from "../dto/responses.js"
import type { PostService } from "../../service/post.types.js"

export function createPostHandler(service: PostService){
    async function getPostsHandler(
        req: Request<{}, {}, CreatePostRequest>,
        res: Response<PostResponse[] | ErrorResponse>
    ) {
        const { take } = req.query
        const { category } = req.query
    
        let takeNumber: number | undefined = undefined
        if (typeof take === "string") {
            takeNumber = parseInt(take, 10)
            if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
                res.status(400).json({ok: false, description: 'take must be a positive integer'})
                return
            }
        }
    
        const categoryStr = typeof category === "string" ? category : undefined

        const posts = await service.getAllPosts(takeNumber, categoryStr)
        res.status(200).json(posts)
    }
    
    async function getPostByIdHandler(
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ) {
        const { id } = req.params
    
        if (typeof id !== "string") {
            res.status(400).json({ ok: false, description: "id is required" })
            return
        }

        const postId = parseInt(id, 10)

        if (!Number.isInteger(postId) || postId < 0) {
            res.status(400).json({ok: false, description: 'id must be a positive integer'})
            return
        }
    
        const post = await service.getPostById(postId)
    
        if (!post) {
            res.status(404).json({ok: false, description: 'post not found'})
            return
        }
    
        res.status(200).json(post)
    }
    
    async function createPostHandler(
        req: Request<{}, {}, any>,
        res: Response<PostResponse | ErrorResponse>
    ) {
        const { title, content, authorId, category } = req.body
    
        if (
            typeof title !== "string" || 
            typeof content !== "string" || 
            typeof authorId !== "number" ||
            typeof category !== "string" ||
            !title.trim() || 
            !content.trim() || 
            !Number.isInteger(authorId) ||
            authorId <= 0 ||
            !category.trim()
        ) {
            res.status(422).json({ok: false, description: "Validation error: invalid fields"})
            return
        }
    
        try {
            const newPost = await service.createPost({
                title: title.trim(),
                content: content.trim(),
                authorId,
                category: category.trim()
            })
            
            res.status(201).json(newPost)
        } 
        catch(error: any) {
            if (error.message === "POST_ALREADY_EXISTS") {
                res.status(409).json({ ok: false, description: "Post with this title already exists" })
                return
            }
            res.status(500).json({ ok: false, description: error.message || "Internal server error" })
        }
    }
    
    return { getPostsHandler, getPostByIdHandler, createPostHandler }
}