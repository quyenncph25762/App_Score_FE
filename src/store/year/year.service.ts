import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IYear } from "./year.interface";

const yearAPI = createApi({
    reducerPath: "year",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["years"],
    endpoints: (builder) => ({
        fetchAllYear: builder.query<IYear[], void>({
            query: () => `/years`,
            providesTags: ["years"]
        })
    })
})

export const { useFetchAllYearQuery } = yearAPI
export default yearAPI