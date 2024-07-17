export interface IUser {
    _id?: string
    FullName: string
    Code: string
    IsActive: boolean
    UserName: string
    Email: string
    Phone: string
    Customer: string
    Avatar: string
    RoleId?: number
    WardId: number
    ObjectId?: number
    Fields?: number
    DistrictId: number
    CityId?: number
    IsDeleted: boolean | number
    CreatorUserId?: number
    ApartmentId: number
    Password?: string
    NameCity?: string
    NameDistrict?: string
    NameWard?: string
    ObjectName?: string
    RoleName?: string
}


export interface IUserState {
    users: IUser[]
    pagination: IPaginate
}

export interface IUserSearchState {
    searchTerm: string
    users: IUser[]
    pagination?: IPaginate
}

// paginate

export interface IPaginateUser {
    results: IUser[]
    pagination: IPaginate
}

interface IPaginate {
    next: number | null
    pages: IPages[]
    prev: number | null
}

interface IPages {
    number: number
    active: boolean
    isDots: boolean
}