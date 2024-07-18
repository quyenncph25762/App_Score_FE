import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IScoreTemp } from "./scoretemp.interface";
import { IIsDeleted } from "../interface/IsDeleted/IsDeleted";
import { IId } from "../interface/_id/id.interface";

const scoreTempApi = createApi({
    reducerPath: "scoretemp",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["scoretemps"],
    endpoints: (builder) => ({
        // lay ra tat ca scoretemp
        fetchAllScoreTemp: builder.query<IScoreTemp[], void>({
            query: () => `/getAll-scoretemp`,
            providesTags: ["scoretemps"]
        }),
        // lay ra tat ca scoretemp trong thung rac
        fetchAllScoreTempFromTrash: builder.query<IScoreTemp[], void>({
            query: () => `/get-trash-scoretemp`,
            providesTags: ["scoretemps"]
        }),
        // lay ra 1 scoretemp
        fetchOneScoreTemp: builder.query<IScoreTemp, number>({
            query: (id) => ({
                method: "GET",
                url: `/${id}/getOne-scoretemp`,
            }),
            providesTags: ["scoretemps"]
        }),
        // them 1 scoretemp
        addScoreTemp: builder.mutation<IScoreTemp[], IScoreTemp>({
            query: (body) => ({
                method: "POST",
                body: body,
                url: "/create-scoretemp"
            }),
            invalidatesTags: ["scoretemps"]
        }),
        // cap nhat scoretemp
        updateScoreTemp: builder.mutation<IScoreTemp[], IScoreTemp>({
            query: ({ _id, ...body }) => ({
                url: `/${_id}/update-scoretemp`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["scoretemps"]
        }),
        // remove vao thung rac
        removeScoreTempToTrash: builder.mutation<IIsDeleted, number>({
            query: (id) => ({
                url: `/${id}/deleteOne-scoretemp`,
                method: "PATCH"
            }),
            invalidatesTags: ["scoretemps"]
        }),
        // khoi phuc
        revertScoreTemp: builder.mutation<IIsDeleted, number>({
            query: (id) => ({
                url: `/${id}/restoreOne-scoretemp`,
                method: "PATCH"
            }),
            invalidatesTags: ["scoretemps"]
        }),
        // remove nhieu
        removeScoreTempByCheckbox: builder.mutation<IId[], IId>({
            query: (role) => ({
                method: "PATCH",
                body: role,
                url: `/deleteAll-selected-scoretemp`
            }),
            invalidatesTags: ["scoretemps"]
        }),
        // khoi phuc nhieu
        revertScoreTempByCheckbox: builder.mutation<IId[], IId>({
            query: (role) => ({
                method: "PATCH",
                body: role,
                url: `/restoreAll-selected-scoretemp`
            }),
            invalidatesTags: ["scoretemps"]
        }),
    })
})

export const { useFetchAllScoreTempQuery, useLazyFetchOneScoreTempQuery, useUpdateScoreTempMutation, useAddScoreTempMutation, useRemoveScoreTempToTrashMutation, useRevertScoreTempMutation, useRemoveScoreTempByCheckboxMutation, useRevertScoreTempByCheckboxMutation, useFetchAllScoreTempFromTrashQuery } = scoreTempApi
export default scoreTempApi