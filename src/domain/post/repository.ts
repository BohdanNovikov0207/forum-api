import type {
	CreatePostInput,
	PostWithCategory,
} from "../../service/post/post.types.js";
import type { Post } from "./entity.ts";

export interface PostRepository {
	getPostById: (id: number) => Promise<PostWithCategory | null>;
	getAllPosts: (
		take?: number,
		categoryName?: string,
	) => Promise<PostWithCategory[]>;
	createPost: (postData: CreatePostInput) => Promise<Post>;
}
