import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../api/baseApi";

type RegisterValues = {
    email: string;
    password: string;
}

export function RegisterForm() {
    const { register, handleSubmit } = useForm<RegisterValues>();
    const [ registerUser ] = useRegisterMutation()
    async function onSubmit(data: RegisterValues){
        try{
            const result = await registerUser(data)
            alert(`Користувач ${result.data?.email} зареєструвався!`)
        }catch{
            alert(`Сталась помилка`)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="email"
                placeholder="Електронна пошта"
                required
                {...register("email")}
            />
            <input
                type="password"
                placeholder="Пароль"
                required
                {...register("password")}
            />
            <button>Зареєструватися</button>
        </form>
    )
}