import type { Config } from "./config";
import { createPasswordHasher } from "./lib/password";
import { createTokenService } from "./lib/tokens";
import { createDb } from "./prisma/db";
import { createCategoryRepository } from "./repository/category";
import { createPostRepository } from "./repository/post";
import { createRefreshSessionRepository } from "./repository/refresh-session";
import { createUserRepository } from "./repository/user.js";
import { createCategoryRouter } from "./router/category.js";
import { createPostRouter } from "./router/post.js";
import { createUserRouter } from "./router/user.js";
import { createCategoryService } from "./service/category.js";
import { createPostService } from "./service/post.js";
import { createAuthService } from "./service/user/user.js";
import { createCategoryHandler } from "./transport/handler/category.js";
import { createPostHandler } from "./transport/handler/post.js";
import { createUserHandler } from "./transport/handler/user/user.js";
import { createRequireAuth } from "./transport/middlewares/require-auth.js";

export function createContainer(config: Config) {
    const db = createDb(config.databaseUrl);

    const users = createUserRepository(db);
    const sessions = createRefreshSessionRepository(db);
    const passwords = createPasswordHasher(config.passwordPepper);
    const posts = createPostRepository(db);
    const categories = createCategoryRepository(db);

    const tokens = createTokenService(config.jwt);
    const authService = createAuthService({ users, sessions, passwords, tokens });
    const postService = createPostService(posts);
    const categoryService = createCategoryService(categories);

    const requireAuth = createRequireAuth(tokens.verifyAccessToken);

    const userHandler = createUserHandler(authService);
    const postHandler = createPostHandler(postService);
    const categoryHandler = createCategoryHandler(categoryService);

    const authRouter = createUserRouter(userHandler, requireAuth);
    const postRouter = createPostRouter(postHandler, requireAuth);
    const categoryRouter = createCategoryRouter(categoryHandler);

    return {
        routers: {
            authRouter,
            postRouter,
            categoryRouter,
        },
    }
}