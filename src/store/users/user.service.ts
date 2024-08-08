import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPaginateUser, IUser } from "./user.interface";
import { BASE_URL } from "../../config/configApi";
import { IIsDeleted } from "../interface/IsDeleted/IsDeleted";
import { IId } from "../interface/_id/id.interface";

const usersApi = createApi({
    reducerPath: "employees",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["employees"],
    endpoints: (builder) => ({
        // lay ra tat ca user
        fetchListUser: builder.query<IPaginateUser, { page: number, searchName: string }>({
            query: ({ page, searchName }) => `/getAllEmployee?page=${page}&searchName=${searchName}`,
            providesTags: ["employees"]
        }),
        // lay ra tat ca admin de phat phieu cham
        fetchListAdminByToScoreFile: builder.query<IPaginateUser, { page: number, searchName: string }>({
            query: ({ page, searchName }) => `/get-employee-to-create-scorefile?page=${page}&searchName=${searchName}`,
            providesTags: ["employees"]
        }),
        // lay ra tat ca user trong thung rac
        fetchListUserFromTrash: builder.query<IUser[], void>({
            query: () => `/trash-employee`,
            providesTags: ["employees"]
        }),

        // xoa vao thung rac
        removeUser: builder.mutation<IUser, number>({
            query: (id) => ({
                url: `/${id}/delete-employee`,
                method: "PATCH"
            }),
            invalidatesTags: ["employees"]
        }),
        // xoa nhieu vao thung rac
        removeUserAll: builder.mutation<number[], number[]>({
            query: (arrId) => ({
                url: `/delete-all-selected-employee`,
                method: "PATCH",
                body: arrId
            }),
            invalidatesTags: ["employees"]
        }),
        // khoi khuc
        revertUser: builder.mutation<IUser[], number>({
            query: (id) => ({
                url: `/${id}/restore-employee`,
                method: "PATCH"
            }),
            invalidatesTags: ["employees"]
        }),
        // khoi khuc
        revertUserAll: builder.mutation<number[], number[]>({
            query: (arrId) => ({
                url: `/restore-all-selected-employee`,
                method: "PATCH",
                body: arrId
            }),
            invalidatesTags: ["employees"]
        }),
        // lay 1 user
        fetchOneUser: builder.query<IUser, number>({
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

export const { useLazyFetchListUserQuery, useRemoveUserMutation, useAddUserMutation, useLazyFetchOneUserQuery, useUpdateUserMutation, useRevertUserMutation, useFetchListUserFromTrashQuery, useRemoveUserAllMutation, useRevertUserAllMutation, useLazyFetchListAdminByToScoreFileQuery } = usersApi;
export default usersApi;
