import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPaginateUser, IUser } from "./user.interface";
import { BASE_URL } from "../../config/configApi";
import { IIsDeleted } from "../interface/IsDeleted/IsDeleted";

const usersApi = createApi({
    reducerPath: "employees",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["employees"],
    endpoints: (builder) => ({
        fetchListUser: builder.query<IPaginateUser, { page: number, searchName: string }>({
            query: ({ page, searchName }) => `/getAllEmployee?page=${page}&searchName=${searchName}`,
            providesTags: ["employees"]
        }),

        // xoa vao thung rac
        removeUser: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...user }) => ({
                url: `/delete-employee`,
                method: "PATCH",
                body: user
            }),
            invalidatesTags: ["employees"]
        }),
        // khoi khuc
        revertUser: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: user
            }),
            invalidatesTags: ["employees"]
        }),
        // lay 1 user
        fetchOneUser: builder.query<IUser, string>({
            query: (id) => `/${id}/getOne-Employee`,
            providesTags: ["employees"]
        }),
        // them user
        addUser: builder.mutation<IUser[], IUser>({
            query: (data) => ({
                url: `/create-employee`,
                body: data,
                method: "POST"
            }),
            invalidatesTags: ["employees"]
        }),
        // cap nhat user
        updateUser: builder.mutation<IUser[], IUser>({
            query: ({ _id, ...data }) => ({
                url: `/${_id}/update-employee`,
                body: data,
                method: "PATCH"
            }),
            invalidatesTags: ["employees"]
        }),
        // Xóa vinh viễn
        // removeUser: builder.mutation<IIsDeletedUser[], IIsDeletedUser>({
        //     query: ({ id, ...user }) => ({
        //         url: `/users/${id}`,
        //         method: "PATCH",
        //         body: user
        //     }),
        //     invalidatesTags: ["employees"]
        // }),
    })
})

export const { useLazyFetchListUserQuery, useRemoveUserMutation, useAddUserMutation, useLazyFetchOneUserQuery, useUpdateUserMutation, useRevertUserMutation } = usersApi;
export default usersApi;
