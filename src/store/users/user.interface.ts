export interface IUser {
    id: string
    name: string
    code: string
    isActive: number
    username: string
    email: string
    address: string
    avatar: string
    WardId?: number
    DepartmentId?: number
    DistrictId?: number
    ProvinceId?: number
    isDeleted: number
}

export interface IIsDeletedUser {
    id?: string
    isDeleted: number
}

export interface IUserState {
    users: IUser[]
}

export interface IUserSearchState {
    searchTerm: string
    users: IUser[]
}