import express from 'express'
import { createPostRouter } from './router/post.js'
import { createPostRepository } from './repository/post.js'
import { createPostService } from './service/post.js'
import { createPostHandler } from './transport/handler/post.js'
import { db } from './prisma/db.js'
import { createCategoryRepository } from './repository/category.js'
import { createCategoryService } from './service/category.js'
import { createCategoryHandler } from './transport/handler/category.js'
import { createCategoryRouter } from './router/category.js'

const HOST = 'localhost'
const PORT = 8000

const app = express()

const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)
const categoryRepo = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepo)
const categoryHandler = createCategoryHandler(categoryService)
const categoryRouter = createCategoryRouter(categoryHandler)

app.use(express.json())
app.use('/', postRouter)
app.use('/categories', categoryRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})