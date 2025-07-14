import { createSlice } from '@reduxjs/toolkit'

// on charge le cart une première fois
const loadCart = () => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('cart')
            return saved ? JSON.parse(saved) : []
        } catch (error) {
            console.error('Error loading cart from localStorage:', error)
            return []
        }
    }
    return []
}

// on save le cart

const saveCart = (cart) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('cart', JSON.stringify(cart))
        }
        catch(error) {
            console.error(error)
        }
    }
}

const panierSlice = createSlice({
    name: 'panier',
    initialState: loadCart(),
    reducers: {
        addBook: (state, action) => {
            state.push(action.payload)
            saveCart(state)
        },
        deleteBook: (state, action) => {
            const newState = state.filter(i => i.id !== action.payload)
            saveCart(newState)
            return newState
        },
        clearCart: (state) => {
            saveCart([])
            return []
        }
    }
})

// calcul de la qunatité totale du panier à utiliser dans la nav et dans le cart
export const selectQuantity = (state) => state.panier.length


export default panierSlice.reducer
export const { addBook, deleteBook, clearCart } = panierSlice.actions