import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";

const statisticApi = createApi({
    reducerPath: "statistics",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["statistics"],
    endpoints: (builder) => ({
        index: builder.query({
            query: () => `/statistics`,
            providesTags: ["statistics"]
        })

    })
})


export const { useIndexQuery } = statisticApi
export default statisticApi