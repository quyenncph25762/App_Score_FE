export interface IDepartment {
    id?: string
    name: string
    isActive: boolean
    IsDeleted: boolean
}


export interface IDepartmentState {
    departments: IDepartment[]
}

export interface IDepartmentSearchState {
    searchTerm: string
    departments: IDepartment[]
}