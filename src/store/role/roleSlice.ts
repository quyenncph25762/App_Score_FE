import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRole, IRoleSearchState, IRoleState } from "./role.interface";

const initalRoleState: IRoleState = {
    roles: []
}
export const initialRoleSearchState: IRoleSearchState = {
    searchTerm: "",
    roles: []
}
const roleSlice = createSlice({
    name: "roleSlice",
    initialState: initalRoleState || initialRoleSearchState,
    reducers: ({
        fetchAllRoleSlice: (state: IRoleState, actions: PayloadAction<IRole[]>) => {
            state.roles = actions.payload
        },
        fetchAllRoleFromTrashSlice: (state: IRoleState, actions: PayloadAction<IRole[]>) => {
            state.roles = actions.payload
        },
        searchRoleSlice: (state: IRoleState, actions: PayloadAction<IRoleSearchState>) => {
            const nameTerm = actions.payload.searchTerm.toLocaleLowerCase().trim()
            const roleFilter = actions.payload.roles.filter((role) => role.IsDeleted === 0 && role.NameRole.toLocaleLowerCase().trim().includes(nameTerm))
            state.roles = roleFilter
        },
    })
})

export const { fetchAllRoleSlice, fetchAllRoleFromTrashSlice, searchRoleSlice } = roleSlice.actions
export default roleSlice.reducer