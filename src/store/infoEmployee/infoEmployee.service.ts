import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IInfoEmployee } from "./infoEmployee.interface";

const infoEmployeeApi = createApi({
    reducerPath: "infoEmployee",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["infoEmployees"],
    endpoints: (builder) => ({
        fetchInfoEmployeeByEmployeeId: builder.query<IInfoEmployee[], string>({
            query: (id) => `/${id}/getAll-info-Employee`,
            providesTags: ["infoEmployees"]
        })
    })
})

export const { useLazyFetchInfoEmployeeByEmployeeIdQuery } = infoEmployeeApi
export default infoEmployeeApi