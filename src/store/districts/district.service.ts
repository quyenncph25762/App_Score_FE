import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IDistrict } from "./district.interface"
import { BASE_URL } from "../../config/configApi"

const districtApi = createApi({
    reducerPath: "districts",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["districts"],
    endpoints: (builer) => ({
        fetchAllDistrict: builer.query<IDistrict[], number>({
            query: (id) => ({
                url: `/${id}/district`,
                method: "GET"
            }),
            providesTags: ["districts"]
        })
    })
})

export const { useLazyFetchAllDistrictQuery } = districtApi

export default districtApi