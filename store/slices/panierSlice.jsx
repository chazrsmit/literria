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

// calcul de la qunatité totale du panier à utiliser dans la nav et dans le cart
export const selectQuantity = (state) => state.panier.length


export default panierSlice.reducer
export const { addBook, deleteBook } = panierSlice.actions