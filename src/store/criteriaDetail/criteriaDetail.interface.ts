export interface ICriteriaDetail {
    _id?: number
    Name: string
    Target: string
    CriteriaId: number
    IsTypePercent: boolean
    IsTypeTotal: boolean
    IsCurrentStatusType: boolean
    // TypePercentValue: number
    // TypeTotalValue: number
    // CurrentStatusValue: number
    Score: number
}