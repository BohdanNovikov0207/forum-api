import express from 'express'
import { createPostRouter } from './router/post.js'
import { createPostRepository } from './repository/post.js'
import { createPostService } from './service/post.js'
import { createPostHandler } from './transport/handler/post.js'

const HOST = 'localhost'
const PORT = 8000

const app = express()

const postRepository = createPostRepository()
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)

app.use(express.json())
app.use('/', postRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})