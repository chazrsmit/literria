import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import paginationReducer from './slices/paginationSlice'
import panierReducer from './slices/panierSlice'
import deliveryReducer from './slices/deliverySlice'


export const store = configureStore(
    {
        reducer: {
            search: searchReducer,
            pagination: paginationReducer,
            panier: panierReducer,
            delivery: deliveryReducer,
        } 
    }
)

