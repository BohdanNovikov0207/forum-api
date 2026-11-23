import { createHash, randomUUID } from "crypto";
import "dotenv/config";
import jwt from "jsonwebtoken";
import type { TokenService } from "../service/user/user.types";

interface TokenServiceOptions {
	accessSecret: string;
	refreshSecret: string;
}

export function createTokenService(options: TokenServiceOptions): TokenService {
	return {
		signAccessToken(userId: number): string {
			return jwt.sign({}, options.accessSecret, {
				algorithm: "HS256",
				subject: String(userId),
				expiresIn: "15m",
			});
		},
		signRefreshToken(userId: number): string {
			return jwt.sign({ type: "refresh" }, options.refreshSecret, {
				algorithm: "HS256",
				subject: String(userId),
				jwtid: randomUUID(),
				expiresIn: "7d",
			});
		},
		verifyAccessToken(token: string): number {
			try {
				const payload = jwt.verify(token, options.accessSecret, {
					algorithms: ["HS256"],
				});
				if (typeof payload === "string" || typeof payload.sub !== "string") {
					throw new Error();
				}
				const userId = Number(payload.sub);
				return userId;
			} catch (error) {
				throw new Error("INVALID_ACCESS_TOKEN");
			}
		},
		verifyRefreshToken(token: string): number {
			try {
				const payload = jwt.verify(token, options.refreshSecret, {
					algorithms: ["HS256"],
				});
				if (
					typeof payload === "string" ||
					typeof payload.sub !== "string" ||
					payload.type !== "refresh"
				) {
					throw new Error();
				}
				const userId = Number(payload.sub);
				return userId;
			} catch (error) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}
		},
		hash(token: string): string {
			return createHash("sha256").update(token).digest("hex");
		}
	}
}