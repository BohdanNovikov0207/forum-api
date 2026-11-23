import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../api/baseApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

type RegisterValues = {
    email: string;
    password: string;
}

export function RegisterForm() {
    const {
        register, 
        handleSubmit, 
        setError,
        reset,
        formState: { errors, isValid, isDirty }
    }  = useForm<RegisterValues>({
        mode: "onChange"
    })
    const [ registerUser, { isSuccess, isLoading } ] = useRegisterMutation()
    async function onSubmit(data: RegisterValues){
        try {
        await registerUser(data).unwrap()
        reset()
    } catch (error) {
        const apiError = error as FetchBaseQueryError
        let message = "Не вдалося зареєструватися. Спробуйте ще раз"

        if (apiError.status === 409) {
            message = "Користувач з таким email вже існує"
        } else if (apiError.status === "FETCH_ERROR" || apiError.status === "TIMEOUT_ERROR") {
            message = "Не вдалося з'єднатися із сервером"
        }

        setError("root", { message })
    }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input
                type="email"
                placeholder="Електронна пошта"
                {...register("email", {
                    required: "Введіть email",
                    maxLength: {
                        value: 256,
                        message: "E-mail занадто довгий"
                    },
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Введіть коректний email"
                    }
                })}
            />
            {errors.email && <p>{errors.email.message}</p>}
            <input
                type="password"
                placeholder="Пароль"
                {...register("password", {
                    required: "Введіть пароль",
                    minLength: {
                        value: 6,
                        message: "Пароль має містити щонайменше 6 символів"
                    }
                })}
            />
            {errors.password && <p>{errors.password.message}</p>}
            <p>
                {!isDirty
                    ? "Заповніть форму"
                    : isValid
                        ? "Поля пройшли перевірку"
                        : "Перевірте дані"}
            </p>
            {errors.root && <p>{errors.root.message}</p>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Реєстрація..." : "Зареєструватися"}
            </button>
            {isSuccess && <p>Користувач успішно зареєстрований! Тепер ви можете увійти</p>}
        </form>
    )
}