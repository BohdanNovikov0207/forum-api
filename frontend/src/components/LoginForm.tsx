import { useForm } from "react-hook-form"
import { useLoginMutation } from "../api/baseApi"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
 
type LoginValues = {
    email: string
    password: string
}

export function LoginForm() {
    const {
        register, 
        handleSubmit, 
        setError,
        formState: { errors, isValid, isDirty }
    }  = useForm<LoginValues>({
        mode: "onChange"
    })
    const [ loginUser, {isLoading} ] = useLoginMutation()
    async function onSubmit(data: LoginValues){
        try { 
            await loginUser(data).unwrap()
        } catch (error) {
            const apiError = error as FetchBaseQueryError
            let message = "Не вдалося увійти в акаунт. Спробуйте ще раз"
            if (apiError.status === 401){
                message = "Неправильний email або пароль"
            } else if (apiError.status === "FETCH_ERROR" || apiError.status === "TIMEOUT_ERROR"){
                message = "Не вдалося з'єднатися із сервером"
            }
            setError("root", {message} )
        }
    }
    return(
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input
                type = "email"
                placeholder="email"
                required
                {...register("email", {
                    required: "Введіть email",
                    maxLength: {
                        value: 256,
                        message: "E-mail занадто довгий"
                    }
                })}
            /> 
            { errors.email && <p>{errors.email.message}</p> }
            <input
                type = "password"
                placeholder="password"
                required
                {...register("password",{
                    required: "Введiть пароль",
                })}
            /> 
            { errors.password && <p>{errors.password.message}</p> }
            <p>{ !isDirty ? "Заповнiть форму" : 
                isValid ? "Поля пройшли перевiрку" :
                "Перевiрте данi"
            }</p>
            { errors.root && <p>{errors.root.message}</p> }
            <button type="submit" disabled={ isLoading }
            >{ isLoading ? "Виконується вхід" : 
                "Увійти"    
            }</button>
        </form>
    )
}