import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { ICriteriaDetail } from "./criteriaDetail.interface";

const criteriaDetailApi = createApi({
    reducerPath: "criteriaDetail",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["cirteriaDetails"],
    endpoints: (builder) => ({
        // lay tat ca tieu chi theo phieu cham
        fetchAllCriteriaDetailByCriteria: builder.query<ICriteriaDetail[], number>({
            query: (id) => ({
                method: "GET",
                url: `/${id}/getDetailCriteria_ByCriteriaId`,
            }),
            providesTags: ["cirteriaDetails"]
        }),
        // 
        updateCriteriaDetail: builder.mutation<ICriteriaDetail[], ICriteriaDetail>({
            query: ({ _id, ...data }) => ({
                method: "PATCH",
                body: data,
                url: `/${_id}/update-criterialDetail`
            })
        }),
        removeCriteriaDetailById: builder.mutation<ICriteriaDetail[], number>({
            query: (id) => ({
                method: "DELETE",
                url: `/${id}/delete-criterialDetail`
            })
        })
    })
})

export const { useFetchAllCriteriaDetailByCriteriaQuery, useUpdateCriteriaDetailMutation, useRemoveCriteriaDetailByIdMutation } = criteriaDetailApi
export default criteriaDetailApi