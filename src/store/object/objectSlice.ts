import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IObject, IObjectState, ISearchState } from "./object.interface";

const initialObjectSlice: IObjectState = {
    objects: []
}

const initialSearchSlice: ISearchState = {
    searchTerm: "",
    objects: []
}
const objectSlice = createSlice({
    name: "objectSlice",
    initialState: initialObjectSlice || initialSearchSlice,
    reducers: ({
        getAllObjectSlice: (state: IObjectState, actions: PayloadAction<IObject[]>) => {
            state.objects = actions.payload.filter((object) => object.isDeleted === 0)
        },
        getObjectFromTrashSlice: (state: IObjectState, actions: PayloadAction<IObject[]>) => {
            state.objects = actions.payload.filter((object) => object.isDeleted === 1)
        },
        searchObjectSlice: (state: IObjectState, actions: PayloadAction<ISearchState>) => {
            const nameTerm = actions.payload.searchTerm.toLocaleLowerCase()
            const listObjectFilter = actions.payload.objects.filter((object) => object.name && object.name.toLowerCase().includes(nameTerm))
            state.objects = listObjectFilter
        }
    })
})

export const { getAllObjectSlice, searchObjectSlice, getObjectFromTrashSlice } = objectSlice.actions
export default objectSlice.reducer