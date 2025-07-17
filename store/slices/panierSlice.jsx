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

    // Load order data (for order process steps)
    const loadOrderData = () => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('orderData')
                return saved ? JSON.parse(saved) : null
            } catch (error) {
                console.error('Error loading order data from localStorage:', error)
                return null
            }
        }
        return null
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

    // Save order data
    const saveOrderData = (orderData) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('orderData', JSON.stringify(orderData))
            }
            catch(error) {
                console.error(error)
            }
        }
    }

    const panierSlice = createSlice({
        name: 'panier',
        initialState: {
            items: loadCart(),
            orderData: loadOrderData() // For storing order info during checkout process
        },
        reducers: {
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
            // New action to store order data during checkout process
            setOrderData: (state, action) => {
                state.orderData = action.payload
                saveOrderData(action.payload)
            },
            // Clear order data after successful payment
            clearOrderData: (state) => {
                state.orderData = null
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('orderData')
                }
            }
        }
    })

    // calcul de la quantité totale du panier à utiliser dans la nav et dans le cart
    export const selectQuantity = (state) => state.panier.items.length

    // Selector for order data
    export const selectOrderData = (state) => state.panier.orderData

    // Selector for cart items
    export const selectCartItems = (state) => state.panier.items

    export default panierSlice.reducer
    export const { addBook, deleteBook, clearCart, setOrderData, clearOrderData } = panierSlice.actions