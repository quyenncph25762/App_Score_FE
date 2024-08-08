import { ICriteria } from "../criteria/criteria.interface"
import { IScoreFileDetail } from "../scorefileDetail/scorefileDetail.interface"

export interface IScoreFile {
    _id?: number
    ScoreTempId?: number
    NameScoreTemp: string
    NameYear: string
    Code: string
    Score: number
    Status: boolean | number
    IsActive: boolean
    IsSend: boolean | number
    Criteria?: ICriteria[]
    ScoreFileDetails: IScoreFileDetail[]
}

export interface IScoreFileState {
    scorefiles: IScoreFile[]
}

export interface IScoreFileSearch {
    searchTerm: string
    scorefiles: IScoreFile[]
}