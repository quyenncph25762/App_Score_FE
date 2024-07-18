export interface IScoreTemp {
    _id?: number
    Name: string
    Code: string
    YearId: number
    ObjectId: number
    IsActive: boolean
    Description: string
    NameObject: string
    NameYear: string
}

export interface IScoreTempState {
    scoreTemps: IScoreTemp[]
}

export interface IScoreTempSearchState {
    searchName: ""
    scoreTemps: IScoreTemp[]
}