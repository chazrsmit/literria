// panierSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  orderData: null,
}

const panierSlice = createSlice({
  name: 'panier',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload
    },
    addBook: (state, action) => {
      state.items.push(action.payload)
    },
    deleteBook: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
    setOrderData: (state, action) => {
      state.orderData = action.payload
    },
    clearOrderData: (state) => {
      state.orderData = null
    }
  }
})

// Selectors
export const selectQuantity = (state) => state.panier.items.length
export const selectOrderData = (state) => state.panier.orderData
export const selectCartItems = (state) => state.panier.items

export default panierSlice.reducer
export const {
  setCart,
  addBook,
  deleteBook,
  clearCart,
  setOrderData,
  clearOrderData
} = panierSlice.actions
