import express from 'express'
import { postRouter } from './router/post.js'

const HOST = 'localhost'
const PORT = 8000

const app = express()

app.use(express.json())

app.use('/', postRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})