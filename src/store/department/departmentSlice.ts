import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDepartment, IDepartmentState } from "./department.interface";

export const initalDepartmentState: IDepartmentState = {
    departments: []
}

const departmentSlice = createSlice({
    name: "departmentSlice",
    initialState: initalDepartmentState,
    reducers: ({
        fetchAllDepartment: (state: IDepartmentState, actions: PayloadAction<IDepartment[]>) => {
            state.departments = actions.payload.filter((department) => department.isDeleted === 0)
        },
        fetchAllDepartmentTrash: (state: IDepartmentState, actions: PayloadAction<IDepartment[]>) => {
            state.departments = actions.payload.filter((department) => department.isDeleted === 1)
        }
    })
})


export const { fetchAllDepartment, fetchAllDepartmentTrash } = departmentSlice.actions
export default departmentSlice.reducer