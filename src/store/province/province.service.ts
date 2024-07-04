import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IDistrict } from "../districts/district.interface";

const provinceApi = createApi({
    reducerPath: "provinces",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000"
    }),
    tagTypes: ["provinces"],
    endpoints: (builer) => ({
        fetchAllProvince: builer.query<IDistrict[], void>({
            query: () => `/province`
        })
    })
})

export const { useFetchAllProvinceQuery } = provinceApi
export default provinceApi