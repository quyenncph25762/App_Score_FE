import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IProvince } from "./province.interface";

const provinceApi = createApi({
    reducerPath: "provinces",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["provinces"],
    endpoints: (builer) => ({
        fetchAllProvince: builer.query<IProvince[], void>({
            query: () => `/cities`
        })
    })
})

export const { useFetchAllProvinceQuery } = provinceApi
export default provinceApi