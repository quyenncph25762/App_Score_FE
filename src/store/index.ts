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
import roleApi from './role/role.service'
import roleSlice from './role/roleSlice'
import apartmentApi from './apartment/apartment.service'
import authApi from './auth/auth.service'
import infoEmployeeApi from './infoEmployee/infoEmployee.service'
import scoreTempApi from './scoretemp/scoretemp.service'
import scoretempSlice from './scoretemp/scoretempSlice'
import criteriaApi from './criteria/criteria.service'
import criteriaDetailApi from './criteriaDetail/criteriaDetail.service'
import yearAPI from './year/year.service'
import scoreFileApi from './scorefile/scorefile.service'
import scoreFileSlice from './scorefile/scoreFileSlice'


export const store = configureStore({
    reducer: {
        // reducer
        // user
        [usersApi.reducerPath]: usersApi.reducer,
        // infoEmployee
        [infoEmployeeApi.reducerPath]: infoEmployeeApi.reducer,
        // address
        [wardApi.reducerPath]: wardApi.reducer,
        [districtApi.reducerPath]: districtApi.reducer,
        [provinceApi.reducerPath]: provinceApi.reducer,
        // department
        [departmentApi.reducerPath]: departmentApi.reducer,
        // object
        [objectApi.reducerPath]: objectApi.reducer,
        // role
        [roleApi.reducerPath]: roleApi.reducer,
        // apartments
        [apartmentApi.reducerPath]: apartmentApi.reducer,
        // slice
        // login
        [authApi.reducerPath]: authApi.reducer,
        // scoretemp
        [scoreTempApi.reducerPath]: scoreTempApi.reducer,
        // criteria
        [criteriaApi.reducerPath]: criteriaApi.reducer,
        // criteria Detail
        [criteriaDetailApi.reducerPath]: criteriaDetailApi.reducer,
        // year
        [yearAPI.reducerPath]: yearAPI.reducer,
        // scorefile
        [scoreFileApi.reducerPath]: scoreFileApi.reducer,
        // user
        userSlice: userSlice,
        // department
        departmentSlice: departmentSlice,
        // object
        objectSlice: objectSlice,
        // role
        roleSlice: roleSlice,
        // scoretemp
        scoreTempSlice: scoretempSlice,
        // scorefile
        scoreFileSlice: scoreFileSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            usersApi.middleware,
            infoEmployeeApi.middleware,
            wardApi.middleware,
            districtApi.middleware,
            provinceApi.middleware,
            departmentApi.middleware,
            objectApi.middleware,
            roleApi.middleware,
            apartmentApi.middleware,
            authApi.middleware,
            scoreTempApi.middleware,
            criteriaApi.middleware,
            criteriaDetailApi.middleware,
            yearAPI.middleware,
            scoreFileApi.middleware
        ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


