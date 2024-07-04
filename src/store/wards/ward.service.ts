import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IWard } from "./ward.interface";

const wardApi = createApi({
    reducerPath: "wards",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000'
    }),
    tagTypes: ["wards"],
    endpoints: (builer) => ({
        fetchAllWard: builer.query<IWard[], void>({
            query: () => `/wards`,
            providesTags: ["wards"]
        })
    })
})

export const { useFetchAllWardQuery } = wardApi
export default wardApi