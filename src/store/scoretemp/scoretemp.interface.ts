import { ICriteria } from "../criteria/criteria.interface"

export interface IScoreTemp {
    _id?: number
    Name: string
    Code?: string
    YearId?: number
    ObjectId?: number
    IsActive?: boolean
    Description?: string
    NameObject?: string
    NameYear?: string
    IsDeleted: boolean | number
    Criteria: ICriteria[]
}

export interface IScoreTempState {
    scoreTemps: IScoreTemp[]
}

export interface IScoreTempSearchState {
    searchName: string
    scoreTemps: IScoreTemp[]
}