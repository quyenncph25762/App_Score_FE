import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPaginateUser, IUser, IUserSearchState, IUserState } from "./user.interface"

export const initialStateListUser: IUserState = {
    users: [],
    pagination: {
        next: null,
        pages: [],
        prev: null
    }
}

export const initialStateSearchUser: IUserSearchState = {
    searchTerm: "",
    users: [],
    pagination: {
        next: null,
        pages: [],
        prev: null
    }
}

const userSlice = createSlice({
    name: "users",
    initialState: initialStateListUser || initialStateSearchUser,
    reducers: ({
        listUsersSlice: (state: IUserState, actions: PayloadAction<IPaginateUser>) => {
            state.users = actions.payload.results
            state.pagination = actions.payload.pagination;
        },
        deleteUserSlice: (state: IUserState, actions: PayloadAction<string>) => {
            state.users = state.users.filter((user) => user._id !== actions.payload)
        },
        listUsersTrashSlice: (state: IUserState, actions: PayloadAction<IPaginateUser>) => {
            state.users = actions.payload.results
        },
        listUserSearchSlice: (state: IUserState, actions: PayloadAction<IUserSearchState>) => {
            const searchName = actions.payload.searchTerm.toLowerCase().trim()

            const listUserFilter = state.users.filter((user) => user.IsDeleted === 0 && user.FullName.toLowerCase().trim().includes(searchName) || user.UserName.toLowerCase().trim().includes(searchName) || user.Customer.toLowerCase().trim().includes(searchName))
            state.users = listUserFilter
        }

    })
})

export const { listUsersSlice, deleteUserSlice, listUsersTrashSlice, listUserSearchSlice } = userSlice.actions
export default userSlice.reducer