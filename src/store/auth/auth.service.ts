import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/configApi";
import { IUser } from "../users/user.interface";
import { IAuth } from "./auth.interface";

const authApi = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["auth"],
    endpoints: (builder) => ({
        // login
        loginApi: builder.mutation<IAuth, IAuth>({
            query: (body) => ({
                method: "POST",
                url: "/login",
                body: body
            })
        })
    })
})
export const { useLoginApiMutation } = authApi
export default authApi