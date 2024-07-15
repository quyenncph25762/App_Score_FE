import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IApartment } from "./apartment.interface";

const apartmentApi = createApi({
    reducerPath: "apartments",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["apartments"],
    endpoints: (builder) => ({
        fetchAllApartment: builder.query<IApartment[], void>({
            query: () => `/apartments`
        })
    })
})

export const { useFetchAllApartmentQuery } = apartmentApi
export default apartmentApi