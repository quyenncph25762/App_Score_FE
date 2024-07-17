import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IObject } from "./object.interface";
import { BASE_URL } from "../../config/configApi";
import { IIsDeleted } from "../interface/IsDeleted/IsDeleted";

const objectApi = createApi({
    reducerPath: "objects",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["objects"],
    endpoints: (builer) => ({
        fetchAllObject: builer.query<IObject[], void>({
            query: () => `/objects`,
            providesTags: ["objects"]
        }),
        // xoa vao thung rac
        removeObject: builer.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...body }) => ({
                url: `/objects/${id}`,
                body: body,
                method: "PATCH"
            }),
            invalidatesTags: ["objects"]
        }),
        // khoi phuc
        revertObject: builer.mutation<IIsDeleted[], IIsDeleted>({
            query: ({ id, ...body }) => ({
                url: `/objects/${id}`,
                body: body,
                method: "PATCH"
            }),
            invalidatesTags: ["objects"]
        }),
        fetchOneObject: builer.query<IObject, string>({
            query: (id) => `/objects/${id}`,
            providesTags: ["objects"]
        }),
        updateObject: builer.mutation<IObject[], IObject>({
            query: ({ _id, ...object }) => ({
                url: `/objects/${_id}`,
                method: "PATCH",
                body: object
            }),
            invalidatesTags: ["objects"]
        }),
        addObject: builer.mutation<IObject[], IObject>({
            query: (object) => ({
                url: `/objects`,
                method: "POST",
                body: object
            }),
            invalidatesTags: ["objects"]
        })
    })
})

export const { useFetchAllObjectQuery, useRemoveObjectMutation, useUpdateObjectMutation, useAddObjectMutation, useLazyFetchOneObjectQuery, useRevertObjectMutation } = objectApi
export default objectApi