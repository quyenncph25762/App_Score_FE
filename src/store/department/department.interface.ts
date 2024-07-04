export interface IDepartment {
    id?: string
    name: string
    isActive: number
    isDeleted: number
}

export interface IIsDeleted {
    id?: string
    isDeleted: number
}

export interface IDepartmentState {
    departments: IDepartment[]
}

export interface IDepartmentSearchState {
    searchTerm: string
    departments: IDepartment[]
}