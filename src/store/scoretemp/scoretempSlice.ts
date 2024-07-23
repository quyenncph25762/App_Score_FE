import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IScoreTemp, IScoreTempSearchState, IScoreTempState } from "./scoretemp.interface";
import { stringToSlug } from "../../components/funtions/removeAccents";

const initialScoreTemp: IScoreTempState = {
    scoreTemps: []
}
const initialScoreTempSearch: IScoreTempSearchState = {
    searchName: "",
    scoreTemps: []
}

const scoreTempSlice = createSlice({
    name: "scoreTemps",
    initialState: initialScoreTemp || initialScoreTempSearch,
    reducers: ({
        fetchAllScoreTempSlice: (state: IScoreTempState, actions: PayloadAction<IScoreTemp[]>) => {
            state.scoreTemps = actions.payload
        },
        removeScoreTempById: (state: IScoreTempState, actions: PayloadAction<number>) => {
            state.scoreTemps = state.scoreTemps.filter((scoretemp) => scoretemp._id !== actions.payload)
        },
        searchScoreTempSlice: (state: IScoreTempState, actions: PayloadAction<IScoreTempSearchState>) => {
            const nameTerm = actions.payload.searchName.toLowerCase()
            const listScoreTempFilter = actions.payload.scoreTemps.filter((scoretemp) => scoretemp.IsDeleted === 0 && scoretemp.Name && stringToSlug(scoretemp.Name).toLowerCase().includes(nameTerm))
            state.scoreTemps = listScoreTempFilter
        }
    })
})

export const { fetchAllScoreTempSlice, searchScoreTempSlice } = scoreTempSlice.actions
export default scoreTempSlice.reducer