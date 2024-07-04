import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IDistrict } from "./district.interface"

const districtApi = createApi({
    reducerPath: "districts",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000"
    }),
    tagTypes: ["districts"],
    endpoints: (builer) => ({
        fetchAllDistrict: builer.query<IDistrict[], void>({
            query: () => `/district`
        })
    })
})

export const { useFetchAllDistrictQuery } = districtApi

export default districtApi