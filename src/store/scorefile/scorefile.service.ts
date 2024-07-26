import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IScoreFile } from "./scofile.interface";

const scoreFileApi = createApi({
    reducerPath: "scorefile",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["scorefiles"],
    endpoints: (builder) => ({
        // fetchAll
        fetchAllScoreFile: builder.query<IScoreFile[], void>({
            query: () => `/scoreFile/all`,
            providesTags: ["scorefiles"]
        }),
        // tao phieu cham
        createScoreFile: builder.mutation<IScoreFile[], IScoreFile>({
            query: (scorefile) => ({
                method: "POST",
                body: scorefile,
                url: `create-scorefile`
            }),
            invalidatesTags: ["scorefiles"]
        }),
        // fetchOne
        fetchOneScoreFile: builder.query<IScoreFile, number>({
            query: (id) => `/getOne-scoreFile/${id}`,
            providesTags: ["scorefiles"]
        }),
        // xoa vao thung rac
        removeOneScoreFile: builder.mutation<IScoreFile, number>({
            query: (id) => ({
                url: "/remove-scoreFile/" + id,
                method: "DELETE"
            }),
            invalidatesTags: ["scorefiles"]
        }),
        // xoa vao thung rac
        updateScoreFileById: builder.mutation<IScoreFile[], IScoreFile>({
            query: ({ _id, ...data }) => ({
                url: "/update-scoreFile/" + _id,
                method: "UPDATE",
                body: data
            }),
            invalidatesTags: ["scorefiles"]
        }),
    })
})

export const { useFetchAllScoreFileQuery, useLazyFetchOneScoreFileQuery, useRemoveOneScoreFileMutation, useUpdateScoreFileByIdMutation, useCreateScoreFileMutation } = scoreFileApi
export default scoreFileApi