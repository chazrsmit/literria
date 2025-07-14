import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import paginationReducer from './slices/paginationSlice'
import panierReducer from './slices/panierSlice'


export const store = configureStore(
    {
        reducer: {
            search: searchReducer,
            pagination: paginationReducer,
            panier: panierReducer
        } 
    }
)

