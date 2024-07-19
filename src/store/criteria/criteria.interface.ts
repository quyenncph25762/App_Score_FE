import { ICriteriaDetail } from "../criteriaDetail/criteriaDetail.interface"

export interface ICriteria {
    _id?: number
    ScoreTempId: number
    Name: string
    FieldId: number
    NameScoreTemp: string
    listCriteria: ICriteriaDetail[]
}