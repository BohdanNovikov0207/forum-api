import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Post } from "../../../src/domain/post/entity"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000" 
  }),
  endpoints: (builder) => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => "/posts"
    })
  })
})

export const { useGetAllPostsQuery } = baseApi