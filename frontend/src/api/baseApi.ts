import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CommentWithAuthor } from "../../../src/domain/comment/entity";
import type { Post } from "../../../src/domain/post/entity";

interface RegisterResponse {
	id: number;
	email: string;
}

interface RegisterRequest {
	email: string;
	password: string;
}

interface LoginRequest {
	email: string;
	password: string;
}

interface UserResponse {
	id: number;
	email: string;
}

interface CreateCommentRequest {
	postId: number;
	content: string;
}

interface DeleteCommentRequest {
	commentId: number;
	postId: number;
}

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:8000",
		credentials: "include",
	}),
	tagTypes: ["Me", "Comments"],
	endpoints: (builder) => ({
		getAllPosts: builder.query<Post[], void>({
			query: () => "/posts",
		}),
		register: builder.mutation<RegisterResponse, RegisterRequest>({
			query: (data) => {
				return {
					url: "/auth/register",
					method: "POST",
					body: data,
				};
			},
		}),
		login: builder.mutation<void, LoginRequest>({
			query: (data) => ({
				url: "/auth/login",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Me"],
		}),
		getMe: builder.query<UserResponse, void>({
			query: () => "/auth/me",
			providesTags: ["Me"],
		}),
		getCommentsByPost: builder.query<CommentWithAuthor[], number>({
			query: (postId) => `/posts/${postId}/comments`,
			providesTags: ["Comments"],
		}),
		createComment: builder.mutation<CommentWithAuthor, CreateCommentRequest>({
			query: ({ postId, content }) => ({
				url: `/posts/${postId}/comments`,
				method: "POST",
				body: { content },
			}),
			invalidatesTags: ["Comments"],
		}),
		deleteComment: builder.mutation<void, DeleteCommentRequest>({
			query: ({ commentId }) => ({
				url: `/comments/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Comments"],
		}),
	}),
});

export const {
	useGetAllPostsQuery,
	useRegisterMutation,
	useLoginMutation,
	useGetMeQuery,
	useGetCommentsByPostQuery,
	useCreateCommentMutation,
	useDeleteCommentMutation,
} = baseApi;