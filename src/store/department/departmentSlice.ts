import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDepartment, IDepartmentSearchState, IDepartmentState } from "./department.interface";
import { stringToSlug } from "../../components/funtions/removeAccents";

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
            state.departments = actions.payload.filter((department) => department.IsDeleted === 0)
        },
        fetchAllDepartmentTrash: (state: IDepartmentState, actions: PayloadAction<IDepartment[]>) => {
            state.departments = actions.payload.filter((department) => department.IsDeleted === 1)
        },
        searchDepartmentSlice: (state: IDepartmentState, actions: PayloadAction<IDepartmentSearchState>) => {
            const nameTerm = actions.payload.searchTerm.toLocaleLowerCase().trim()
            console.log(nameTerm)
            const departmentFilter = actions.payload.departments.filter((department) => department.IsDeleted === 0 && stringToSlug(department.Name).toLocaleLowerCase().trim().includes(nameTerm))
            state.departments = departmentFilter
        },
    })
})


export const { fetchAllDepartmentSlice, fetchAllDepartmentTrash, searchDepartmentSlice } = departmentSlice.actions
export default departmentSlice.reducer