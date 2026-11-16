import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Post } from "../../../src/domain/post/entity"

interface RegisterResponse {
    id: number;
    email: string;
}

interface RegisterRequest {
    email: string;
    password: string;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000" 
  }),
  endpoints: (builder) => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => "/posts"
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => {
          return {
              url: "/auth/register",
              method: "POST",
              body: data 
        }
      }
    })
  })
})

export const { useGetAllPostsQuery, useRegisterMutation } = baseApi