import { getAllPosts, getPostById, createPost } from "../service/post.js"

export function getPostsHandler(req, res) {
    const { take } = req.query
    const { category } = req.query

    if (take) {
        const takeNumber = parseInt(take, 10)
        if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
            res.status(400).json('take must be a positive integer')
            return
        }
    }

    const posts = getAllPosts(take, category)
    return res.status(200).json(posts)
}

export function getPostByIdHandler(req, res) {
    const { id } = req.params
    const postId = parseInt(id, 10)

    if (!Number.isInteger(postId) || postId < 0) {
        res.status(400).json('id must be a positive integer')
        return
    }

    const post = getPostById(postId)

    if (!post) {
        res.status(404).json('post not found')
        return
    }

    return res.status(200).json(post)
}

export async function createPostHandler(req, res) {
    const { title, content, author, category } = req.body

    if(typeof title !== "string" || typeof content !== "string" || !title.trim() || !content.trim()) {
        return res.status(422).json("Validation error")
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
        return res.status(500).json(error.message)
    }
}