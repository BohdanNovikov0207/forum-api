import { Router } from "express";
import type { UserHandler } from "../transport/handler/user/user.types";
import type { RequestHandler } from "express";
import { createRequireAuth } from "../transport/middlewares/require-auth";

export function createUserRouter(handler: UserHandler, requireAuth: RequestHandler){
    const router = Router()

    router.post('/register', handler.register)
    router.post("/login", handler.login)
    router.post('/refresh', handler.refresh)
    router.get('/me', requireAuth, handler.me)
    return router
}