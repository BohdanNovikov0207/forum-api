import type {
	CommentWithAuthor,
	CreateCommentInput,
} from "../../domain/comment/entity.js";
import type { CommentRepository } from "../../domain/comment/repository.js";

export interface PostLookupRepository {
	getPostById(id: number): Promise<{ id: number } | null>;
}

export interface CommentServiceDependencies {
	comments: CommentRepository;
	posts: PostLookupRepository;
}

export interface CreateCommentServiceInput {
	postId: number;
	authorId: number;
	content: unknown;
}

export interface DeleteCommentServiceInput {
	commentId: number;
	userId: number;
}

export interface CommentService {
	getPostComments(postId: number): Promise<CommentWithAuthor[]>;
	createComment(input: CreateCommentServiceInput): Promise<CommentWithAuthor>;
	deleteComment(input: DeleteCommentServiceInput): Promise<void>;
}