'use client'

import { useDispatch, useSelector } from 'react-redux'
import { setQuery } from '@/store/slices/searchSlice'

export default function SearchBar() {
    const query = useSelector(state => state.search.query)
    const dispatch = useDispatch()

    return (
        <input 
            type="text"
            value={query}
            placeholder="Enter your search"
            onChange={(e)=>dispatch(setQuery(e.target.value))}
        />
    )
}