import { createSlice } from '@reduxjs/toolkit'

// on veut afficher 12 livres à la fois (on déclare l'initialState ici)
const initialState = {
    displayCount: 12,
    itemsPerPage: 12
}

const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        loadMore: (state) => {
            state.displayCount = state.displayCount + state.itemsPerPage
        },
        resetPagination: (state) => {
            state.displayCount = state.itemsPerPage
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload
            state.displayCount = action.payload
        }
     }
})

export const { loadMore, resetPagination, setItemsPerPage } = paginationSlice.actions
export default paginationSlice.reducer

