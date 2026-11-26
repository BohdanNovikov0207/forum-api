import type {
	Comment,
	CommentWithAuthor,
	CreateCommentInput,
} from "./entity.js";

export interface CommentRepository {
	findCommentByPostId(postId: number): Promise<CommentWithAuthor[]>;
	findCommentById(commentId: number): Promise<Comment | null>;
	createComment(data: CreateCommentInput): Promise<CommentWithAuthor>;
	deleteCommentById(commentId: number): Promise<void>;
}