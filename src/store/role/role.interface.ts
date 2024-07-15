export interface IRole {
    _id?: string
    NameRole: string
    Note: string
    IsDeleted: boolean | number
}


export interface IRoleState {
    roles: IRole[]
}

export interface IRoleSearchState {
    searchTerm: string
    roles: IRole[]
}
