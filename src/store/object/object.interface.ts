export interface IObject {
    id: string
    name: string
    isActive: number
    description: string
    isDeleted: number
}

export interface IObjectState {
    objects: IObject[]
}

export interface ISearchState {
    searchTerm: string
    objects: IObject[]
}