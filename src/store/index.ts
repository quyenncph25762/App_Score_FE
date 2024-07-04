import { configureStore } from '@reduxjs/toolkit'
import usersApi from './users/user.service'
import userSlice from './users/userSlice'
import wardApi from './wards/ward.service'
import districtApi from './districts/district.service'
import provinceApi from './province/province.service'
import departmentApi from './department/department.service'
import departmentSlice from './department/departmentSlice'
import objectApi from './object/object.service'
import objectSlice from './object/objectSlice'

export const store = configureStore({
    reducer: {
        // reducer
        // user
        [usersApi.reducerPath]: usersApi.reducer,
        // address
        [wardApi.reducerPath]: wardApi.reducer,
        [districtApi.reducerPath]: districtApi.reducer,
        [provinceApi.reducerPath]: provinceApi.reducer,
        // department
        [departmentApi.reducerPath]: departmentApi.reducer,
        // object
        [objectApi.reducerPath]: objectApi.reducer,
        // slice
        // user
        userSlice: userSlice,
        departmentSlice: departmentSlice,
        objectSlice: objectSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            // user
            .concat([usersApi.middleware])
            // address
            .concat([wardApi.middleware])
            .concat([districtApi.middleware])
            .concat([provinceApi.middleware])
            //department
            .concat([departmentApi.middleware])
            // object
            .concat([objectApi.middleware])
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch