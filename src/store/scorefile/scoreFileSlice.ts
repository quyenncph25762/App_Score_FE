import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IScoreFile, IScoreFileSearch, IScoreFileState } from "./scofile.interface";

export const initialStateScoreFile: IScoreFileState = {
    scorefiles: []
}

export const initialSearchState: IScoreFileSearch = {
    searchTerm: "",
    scorefiles: []
}

const scoreFileSlice = createSlice({
    name: "scorefile",
    initialState: initialStateScoreFile || initialSearchState,
    reducers: ({
        fetchAllScoreFileSlice: (state: IScoreFileState, actions: PayloadAction<IScoreFile[]>) => {
            state.scorefiles = actions.payload
        },
    })
})

export const { fetchAllScoreFileSlice } = scoreFileSlice.actions
export default scoreFileSlice.reducer