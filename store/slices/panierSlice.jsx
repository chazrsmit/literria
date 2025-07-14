import { createSlice } from '@reduxjs/toolkit'

const panierSlice = createSlice({
    name: 'panier',
    initialState: [],
    reducers: {
        addBook: (state, action) => {
            state.push(action.payload)
        },
        deleteBook: (state, action) => {
            return state.filter(i => i.id !== action.payload)
        }
    }
})

export default panierSlice.reducer
export const { addBook, deleteBook } = panierSlice.actions