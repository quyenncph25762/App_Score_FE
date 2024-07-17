export interface IObject {
    _id?: string
    NameObject: string
    IsDeleted: boolean | number
}

export interface IObjectState {
    objects: IObject[]
}

export interface ISearchState {
    searchTerm: string
    objects: IObject[]
}