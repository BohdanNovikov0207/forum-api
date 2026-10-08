import type { Request, Response } from "express"
import type { CreatePostRequest } from "../dto/requests.js"
import type { ErrorResponse } from "../dto/errors.js"
import type { PostResponse } from "../dto/responses.js"
import type { PostService } from "../../service/post.types.js"
import { createPostRepository } from "../../repository/post.js"

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

        const posts = service.getAllPosts(takeNumber, categoryStr)
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
    
        const post = service.getPostById(postId)
    
        if (!post) {
            res.status(404).json({ok: false, description: 'post not found'})
            return
        }
    
        res.status(200).json(post)
    }
    
    async function createPostHandler(
        req: Request<{}, {}, CreatePostRequest>,
        res: Response<PostResponse | ErrorResponse>
    ) {
        const { title, content, author, category } = req.body
    
        if(typeof title !== "string" || typeof content !== "string" || !title.trim() || !content.trim()) {
            res.status(422).json({ok: false, description: "Validation error"})
            return
        }
    
        try{
            const newPost = await service.createPost({
                id: createPostRepository().posts.length + 1,
                title: title,
                content: content,
                author: author,
                category: category
            })
            if (!newPost) {
                res.status(500).json({ ok: false, description: "Failed to create post" })
                return
            }
        
            res.status(201).json(newPost)
        } 
        catch(error){
            let errorMessage = "Unknown error"
            if (error instanceof Error) {
                errorMessage = error.message
            }
            res.status(500).json({ok: false, description: `${errorMessage}`})
            return
        }
    }
    return { getPostsHandler, getPostByIdHandler, createPostHandler }
}