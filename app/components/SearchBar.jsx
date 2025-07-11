'use client'

import { useDispatch, useSelector } from 'react-redux'
import { setQuery } from '@/store/slices/searchSlice'
import './searchBar.css'


export default function SearchBar() {
    const query = useSelector(state => state.search.query)
    const dispatch = useDispatch()

    return (
        <div className="search-input-wrapper">
            <input 
                type="text"
                value={query}
                placeholder="Search"
                onChange={(e) => dispatch(setQuery(e.target.value))}
            />
            <svg
                className="search-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
        </div>
    )
}