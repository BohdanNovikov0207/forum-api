import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useForm } from "react-hook-form";
import {
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsByPostQuery,
} from "../api/baseApi.ts";

interface PostCommentsProps {
	postId: number;
	currentUserId?: number;
}

type CommentFormValues = {
	content: string;
};

function getCommentErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as FetchBaseQueryError | undefined;
	if (!apiError || !("status" in apiError)) {
		return fallback;
	}

	if (
		apiError.status === "FETCH_ERROR" ||
		apiError.status === "TIMEOUT_ERROR"
	) {
		return "Не вдалося з'єднатися із сервером";
	}

	if (apiError.status === 401) {
		return "Необхідна авторизація";
	}

	if (
		typeof apiError.data === "object" &&
		apiError.data !== null &&
		"description" in apiError.data &&
		typeof (apiError.data as { description?: unknown }).description === "string"
	) {
		return (apiError.data as { description: string }).description;
	}

	return fallback;
}

interface CreateCommentFormProps {
	postId: number;
}

function CreateCommentForm({ postId }: CreateCommentFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isValid, isDirty },
	} = useForm<CommentFormValues>({
		mode: "onChange",
	});

	const [createComment, { isLoading }] = useCreateCommentMutation();

	async function onSubmit(data: CommentFormValues) {
		try {
			await createComment({
				postId,
				content: data.content.trim(),
			}).unwrap();
			reset();
		} catch (error) {
			const message = getCommentErrorMessage(
				error,
				"Не вдалося додати коментар. Спробуйте ще раз",
			);
			setError("root", { message });
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<textarea
				placeholder="Напишіть коментар..."
				rows={3}
				{...register("content", {
					required: "Введіть текст коментаря",
					validate: (value) =>
						value.trim().length > 0 || "Коментар не може бути порожнім",
					maxLength: {
						value: 500,
						message: "Коментар не може перевищувати 500 символів",
					},
				})}
			/>
			{errors.content && <p>{errors.content.message}</p>}
			<p>
				{!isDirty
					? "Заповніть форму"
					: isValid
						? "Поля пройшли перевірку"
						: "Перевірте дані"}
			</p>
			{errors.root && <p>{errors.root.message}</p>}
			<button type="submit" disabled={isLoading}>
				{isLoading ? "Надсилання..." : "Додати коментар"}
			</button>
		</form>
	);
}

export function PostComments({ postId, currentUserId }: PostCommentsProps) {
	const {
		data: comments = [],
		isLoading,
		isError,
	} = useGetCommentsByPostQuery(postId);

	const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

	async function handleDelete(commentId: number) {
		try {
			await deleteComment({ commentId, postId }).unwrap();
		} catch {}
	}

	return (
		<div className="post-comments">
			<h4>Коментарі</h4>

			{isLoading && <p>Завантаження коментарів...</p>}
			{isError && <p>Помилка завантаження коментарів</p>}

			{!isLoading && !isError && comments.length === 0 && (
				<p>Коментарів поки немає</p>
			)}

			{!isLoading && !isError && comments.length > 0 && (
				<ul>
					{comments.map((comment) => {
						const isAuthor =
							typeof currentUserId === "number" &&
							comment.authorId === currentUserId;

						return (
							<li key={comment.id}>
								<div>
									<strong>
										{comment.author?.email ?? `User #${comment.authorId}`}
									</strong>
								</div>
								<p>{comment.content}</p>
								{isAuthor && (
									<button
										type="button"
										disabled={isDeleting}
										onClick={() => handleDelete(comment.id)}
									>
										Видалити
									</button>
								)}
							</li>
						);
					})}
				</ul>
			)}

			{typeof currentUserId === "number" ? (
				<CreateCommentForm postId={postId} />
			) : (
				<p>Увійдіть, щоб залишити коментар</p>
			)}
		</div>
	);
}