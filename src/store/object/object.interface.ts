export interface IObject {
    id: string
    name: string
    isActive: boolean
    description: string
    IsDeleted: boolean
}

export interface IObjectState {
    objects: IObject[]
}

export interface ISearchState {
    searchTerm: string
    objects: IObject[]
}