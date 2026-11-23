import cookieParser from "cookie-parser";
import type { Config } from "./config";
import { createContainer } from "./container";
import express from "express"
import cors from "cors";
import { ROUTES } from "./shared/constants/routes";

export function createApp(config: Config) {
    const { routers } = createContainer(config)
    const app = express();
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.use(express.json());

    app.use(ROUTES.PRODUCTS, routers.postRouter);
    app.use(ROUTES.CATEGORIES, routers.categoryRouter);
    app.use(ROUTES.AUTH, routers.authRouter);

    return app
}
    