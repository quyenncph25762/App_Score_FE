import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { ICriteria } from "./criteria.interface";
import { IIsDeleted } from "../interface/IsDeleted/IsDeleted";

const criteriaApi = createApi({
    reducerPath: "criteria",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["criteria"],
    endpoints: (builder) => ({
        // lay tat ca tieu chi theo phieu cham
        fetchAllCriteriaByScoreTempId: builder.query<ICriteria[], number>({
            query: (id) => ({
                method: "GET",
                url: `/${id}/get-ByScoretempId-criteria`,
            }),
            providesTags: ["criteria"]
        }),
        // lay 1 tieu chi theo id
        fetchOneCriteriaById: builder.query<ICriteria, number>({
            query: (id) => ({
                method: "GET",
                url: `/${id}/getOne-criteria`
            }),
            providesTags: ["criteria"]
        }),
        // them 1 scoretemp
        addCriteria: builder.mutation<ICriteria[], ICriteria>({
            query: (body) => ({
                method: "POST",
                body: body,
                url: "/criteria/add"
            }),
            invalidatesTags: ["criteria"]
        }),
        // cap nhat scoretemp
        updateCriteria: builder.mutation<ICriteria[], ICriteria>({
            query: ({ _id, ...body }) => ({
                url: `/${_id}/criteria`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["criteria"]
        }),
        // remove vao thung rac
        removeCriteriaToTrash: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...data }) => ({
                url: `/criteria/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["criteria"]
        }),
        // xoa vinh vien
        removeCriteria: builder.mutation<ICriteria, number>({
            query: (id) => ({
                url: `/criteria-remove/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["criteria"]
        }),
        // khoi phuc
        revertCriteria: builder.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...data }) => ({
                url: `/criteria/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["criteria"]
        }),
    })
})

export const { useLazyFetchAllCriteriaByScoreTempIdQuery, useFetchOneCriteriaByIdQuery, useAddCriteriaMutation, useUpdateCriteriaMutation, useRemoveCriteriaToTrashMutation, useRevertCriteriaMutation } = criteriaApi
export default criteriaApi