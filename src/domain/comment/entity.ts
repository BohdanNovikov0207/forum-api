export interface CommentAuthor {
	id: number;
	email: string;
}

export interface Comment {
	id: number;
	content: string;
	postId: number;
	authorId: number;
	createdAt: Date;
}

export interface CommentWithAuthor extends Comment {
	author: CommentAuthor;
}

export interface CreateCommentInput {
	content: string;
	postId: number;
	authorId: number;
}