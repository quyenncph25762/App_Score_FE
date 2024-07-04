import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IIsDeletedUser, IUser } from "./user.interface";

const usersApi = createApi({
    reducerPath: "users",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000'
    }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        fetchListUser: builder.query<IUser[], void>({
            query: () => `/users`,
            providesTags: ["users"]
        }),
        // xoa vao thung rac
        removeUser: builder.mutation<IIsDeletedUser[], IIsDeletedUser>({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: user
            }),
            invalidatesTags: ["users"]
        }),
        // khoi khuc
        revertUser: builder.mutation<IIsDeletedUser[], IIsDeletedUser>({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: user
            }),
            invalidatesTags: ["users"]
        }),
        // lay 1 user
        fetchOneUser: builder.query<IUser, string>({
            query: (id) => `/users/${id}`,
            providesTags: ["users"]
        }),
        // them user
        addUser: builder.mutation<IUser[], IUser>({
            query: (data) => ({
                url: `/users`,
                body: data,
                method: "POST"
            }),
            invalidatesTags: ["users"]
        }),
        // cap nhat user
        updateUser: builder.mutation<IUser[], IUser>({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                body: data,
                method: "PATCH"
            }),
            invalidatesTags: ["users"]
        })
    })
})

export const { useFetchListUserQuery, useRemoveUserMutation, useAddUserMutation, useFetchOneUserQuery, useUpdateUserMutation, useRevertUserMutation } = usersApi;
export default usersApi;
