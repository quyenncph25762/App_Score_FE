export interface IUser {
    _id?: string
    FullName: string
    Code: string
    Gender: string
    // isActive: boolean
    UserName: string
    Email: string
    Address: string
    Avatar: string
    WardId: number
    ObjectId?: number
    DepartmentId?: number
    DistrictId: number
    ProvinceId: number
    IsDeleted: boolean | number
    CreatorUserId?: number
    ApartmentId: number
    Password?: string
}


export interface IUserState {
    users: IUser[]
}

export interface IUserSearchState {
    searchTerm: string
    users: IUser[]
}