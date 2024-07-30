import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IObject, IObjectState, ISearchState } from "./object.interface";
import { stringToSlug } from "../../components/funtions/removeAccents";

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
            state.objects = actions.payload.filter((object) => object.IsDeleted === 0)
        },
        getObjectFromTrashSlice: (state: IObjectState, actions: PayloadAction<IObject[]>) => {
            state.objects = actions.payload.filter((object) => object.IsDeleted === 1)
        },
        searchObjectSlice: (state: IObjectState, actions: PayloadAction<ISearchState>) => {
            const nameTerm = stringToSlug(actions.payload.searchTerm).toLocaleLowerCase()
            const listObjectFilter = actions.payload.objects.filter((object) => object.IsDeleted === 0 && object.NameObject && stringToSlug(object.NameObject).toLowerCase().includes(nameTerm))
            state.objects = listObjectFilter
        }
    })
})

export const { getAllObjectSlice, searchObjectSlice, getObjectFromTrashSlice } = objectSlice.actions
export default objectSlice.reducer