import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser, IUserSearchState, IUserState } from "./user.interface"

export const initialStateListUser: IUserState = {
    users: []
}

export const initialStateSearchUser: IUserSearchState = {
    searchTerm: "",
    users: []
}

const userSlice = createSlice({
    name: "users",
    initialState: initialStateListUser || initialStateSearchUser,
    reducers: ({
        listUsersSlice: (state: IUserState, actions: PayloadAction<IUser[]>) => {
            state.users = actions.payload
            state.users = state.users.filter((item) => item.isDeleted === 0)
        },
        deleteUserSlice: (state: IUserState, actions: PayloadAction<string>) => {
            state.users = state.users.filter((user) => user.id !== actions.payload)
        },
        listUsersTrashSlice: (state: IUserState, actions: PayloadAction<IUser[]>) => {
            state.users = actions.payload
            state.users = state.users.filter((item) => item.isDeleted === 1)
        },
        listUserSearchSlice: (state: IUserState, actions: PayloadAction<IUserSearchState>) => {
            const searchName = actions.payload.searchTerm.toLowerCase()
            const listUserFilter = state.users.filter((user) => user.name && user.name.toLowerCase().includes(searchName))
            state.users = listUserFilter
        }

    })
})

export const { listUsersSlice, deleteUserSlice, listUsersTrashSlice, listUserSearchSlice } = userSlice.actions
export default userSlice.reducer