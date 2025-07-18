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
      saveCart(state.items)
    },
    deleteBook: (state, action) => {
      const newItems = state.items.filter(i => i.id !== action.payload)
      state.items = newItems
      saveCart(newItems)
    },
    clearCart: (state) => {
      state.items = []
      saveCart([])
    },
    setOrderData: (state, action) => {
      state.orderData = action.payload
      saveOrderData(action.payload)
    },
    clearOrderData: (state) => {
      state.orderData = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('orderData')
      }
    }
  }
})

// Helpers remain the same
const saveCart = (cart) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
      console.error(error)
    }
  }
}

const saveOrderData = (orderData) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('orderData', JSON.stringify(orderData))
    } catch (error) {
      console.error(error)
    }
  }
}

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
