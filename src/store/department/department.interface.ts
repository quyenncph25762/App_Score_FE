export interface IDepartment {
    _id?: string
    Name: string
    IsDeleted?: boolean | number
}


export interface IDepartmentState {
    departments: IDepartment[]
}

export interface IDepartmentSearchState {
    searchTerm: string
    departments: IDepartment[]
}