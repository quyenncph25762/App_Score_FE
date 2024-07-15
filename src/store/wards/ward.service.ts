import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IWard } from "./ward.interface";
import { BASE_URL } from "../../config/configApi";

const wardApi = createApi({
    reducerPath: "wards",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["wards"],
    endpoints: (builer) => ({
        fetchAllWard: builer.query<IWard[], number>({
            query: (id) => `/${id}/ward`,
            providesTags: ["wards"]
        })
    })
})

export const { useLazyFetchAllWardQuery } = wardApi
export default wardApi