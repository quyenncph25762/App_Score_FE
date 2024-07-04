import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IDepartment, IIsDeleted } from "./department.interface";

const departmentApi = createApi({
    reducerPath: "departments",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000"
    }),
    tagTypes: ["departments"],
    endpoints: (builder) => ({
        fetchAllDepartment: builder.query<IDepartment[], void>({
            query: () => `/department`,
            providesTags: ["departments"]
        }),
        addDepartment: builder.mutation<IDepartment[], IDepartment>({
            query: (department) => ({
                url: '/department',
                method: "POST",
                body: department
            }),
            invalidatesTags: ["departments"]
        }),
        // remove vao thung rac
        removeDepartment: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...department }) => ({
                method: "PATCH",
                url: `/department/${id}`,
                body: department
            }),
            invalidatesTags: ["departments"]
        }),
        // khoi phuc
        revertDepartment: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...department }) => ({
                method: "PATCH",
                url: `/department/${id}`,
                body: department
            }),
            invalidatesTags: ["departments"]
        }),
        // lay 1 phong ban
        fetchOneDepartment: builder.query<IDepartment, string>({
            query: (id) => `/department/${id}`,
            providesTags: ["departments"]
        }),
        updateDepartment: builder.mutation<IDepartment[], IDepartment>({
            query: ({ id, ...department }) => ({
                url: `/department/${id}`,
                method: "PATCH",
                body: department
            }),
            invalidatesTags: ["departments"]
        }),
    })
})

export const { useFetchAllDepartmentQuery, useAddDepartmentMutation, useRemoveDepartmentMutation, useUpdateDepartmentMutation, useFetchOneDepartmentQuery, useRevertDepartmentMutation } = departmentApi
export default departmentApi