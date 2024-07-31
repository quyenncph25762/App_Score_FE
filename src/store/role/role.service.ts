import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IRole } from "./role.interface";
import { IIsDeleted } from "../interface/IsDeleted/IsDeleted";
import { IId } from "../interface/_id/id.interface";

const roleApi = createApi({
    reducerPath: "roles",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["roles"],
    endpoints: (builder) => ({
        fetchAllRole: builder.query<IRole[], void>({
            query: () => `/roles`,
            providesTags: ["roles"]
        }),
        // Láy tất cả từ thùng rác
        fetchAllRoleFromTrash: builder.query<IRole[], void>({
            query: () => `/trash-roles`,
            providesTags: ["roles"]
        }),
        // them vai tro
        addRole: builder.mutation<IRole[], IRole>({
            query: (role) => ({
                method: "POST",
                url: "/create-role",
                body: role
            }),
            invalidatesTags: ["roles"]
        }),
        // sua vai tro
        updateRole: builder.mutation<IRole[], IRole>({
            query: ({ _id, ...role }) => ({
                method: "PATCH",
                url: `/${_id}/role`,
                body: role
            }),
            invalidatesTags: ["roles"]
        }),
        // lấy 1 vai trò
        fetchOneRole: builder.query<IRole, string>({
            query: (id) => `/${id}/one-role/`,
            providesTags: ["roles"]
        }),
        // xoa vao thung rac
        removeRoleToTrash: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...role }) => ({
                method: "PATCH",
                body: role,
                url: `/${id}/delete-role`
            }),
            invalidatesTags: ["roles"]
        }),
        // xoa nhieu
        removeRoleToTrashByCheckbox: builder.mutation<IId[], IId>({
            query: (role) => ({
                method: "PATCH",
                body: role,
                url: `/delete-selected-roles`
            }),
            invalidatesTags: ["roles"]
        }),
        // khôi phục
        revertRole: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...role }) => ({
                method: "PATCH",
                body: role,
                url: `/${id}/restore`
            }),
            invalidatesTags: ["roles"]
        }),
        // xoa nhieu
        revertRoleByCheckbox: builder.mutation<IId[], IId>({
            query: (role) => ({
                method: "PATCH",
                body: role,
                url: `/restore-selected-roles`
            }),
            invalidatesTags: ["roles"]
        }),
    })
})

export const { useFetchAllRoleQuery, useLazyFetchOneRoleQuery, useAddRoleMutation, useUpdateRoleMutation, useRemoveRoleToTrashMutation, useRevertRoleMutation, useFetchAllRoleFromTrashQuery, useRemoveRoleToTrashByCheckboxMutation, useRevertRoleByCheckboxMutation } = roleApi

export default roleApi