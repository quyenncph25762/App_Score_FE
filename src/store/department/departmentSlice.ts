import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDepartment, IDepartmentSearchState, IDepartmentState } from "./department.interface";

export const initalDepartmentState: IDepartmentState = {
    departments: []
}

export const initialDepartmentSearchState: IDepartmentSearchState = {
    searchTerm: "",
    departments: []
}

const departmentSlice = createSlice({
    name: "departmentSlice",
    initialState: initalDepartmentState || initialDepartmentSearchState,
    reducers: ({
        fetchAllDepartmentSlice: (state: IDepartmentState, actions: PayloadAction<IDepartment[]>) => {
            state.departments = actions.payload.filter((department) => department.IsDeleted === false)
        },
        fetchAllDepartmentTrash: (state: IDepartmentState, actions: PayloadAction<IDepartment[]>) => {
            state.departments = actions.payload.filter((department) => department.IsDeleted === true)
        },
        searchDepartmentSlice: (state: IDepartmentState, actions: PayloadAction<IDepartmentSearchState>) => {
            const nameTerm = actions.payload.searchTerm.toLocaleLowerCase().trim()
            const departmentFilter = actions.payload.departments.filter((department) => department.IsDeleted === false && department.name.toLocaleLowerCase().trim().includes(nameTerm))
            state.departments = departmentFilter
        },
    })
})


export const { fetchAllDepartmentSlice, fetchAllDepartmentTrash, searchDepartmentSlice } = departmentSlice.actions
export default departmentSlice.reducer