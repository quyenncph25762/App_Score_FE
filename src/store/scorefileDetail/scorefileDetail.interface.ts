export interface IScoreFileDetail {
    _id?: number
    NameScoreTempDetail: string
    TargetScoreTempDetail: string
    ScorefileId?: string
    CriteriaDetailId?: string
    EmployeeId?: string
    TypePercentValue: number
    TypeTotalValue: number
    CurrentStatusValue: number
    IsCurrentStatusType?: boolean
    IsTypePercent?: boolean
    IsTypeTotal?: boolean
}

export interface IScoreFileDetailState {
    scoreFileDetails: IScoreFileDetail[]
}