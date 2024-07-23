import { IScoreFileDetail } from "../scorefileDetail/scorefileDetail.interface"

export interface IScoreFile {
    _id?: number
    ScoreTempId?: number
    NameScoretemp: string
    Code: string
    Score: number
    Status: number
    IsActive: boolean
    ScoreFileDetails: IScoreFileDetail[]
}

export interface IScoreFileState {
    scorefiles: IScoreFile[]
}

export interface IScoreFileSearch {
    searchTerm: string
    scorefiles: IScoreFile[]
}