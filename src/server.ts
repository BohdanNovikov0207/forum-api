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
import { createUserRepository } from './repository/user.js'
import { createAuthService } from './service/user/user.js'
import { createUserHandler } from './transport/handler/user/user.js'
import { hashPassword, verifyPassword } from "./lib/password.js"
import { createUserRouter } from './router/user.js'
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "./lib/jwt.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createRequireAuth } from './transport/middlewares/require-auth.js'

const HOST = 'localhost'
const PORT = 8000

const app = express()

const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const requireAuth = createRequireAuth(verifyAccessToken)
const postRouter = createPostRouter(postHandler, requireAuth)

const categoryRepo = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepo)
const categoryHandler = createCategoryHandler(categoryService)
const categoryRouter = createCategoryRouter(categoryHandler)

const userRepository = createUserRepository(db)
const userService = createAuthService(userRepository, 
    { hash: hashPassword, verify: verifyPassword}, 
    { signAccessToken, signRefreshToken},
    { verifyAccessToken, verifyRefreshToken}
)
const userHandler = createUserHandler(userService)
const userRouter = createUserRouter(userHandler, requireAuth)

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(cookieParser())
app.use(express.json())

app.use('/', postRouter)
app.use('/categories', categoryRouter)
app.use("/auth", userRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})