'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getBooks } from '@/app/lib/getBooks'
import SearchBar from '@/app/components/SearchBar'

export default function Catalog() {

    const [books, setBooks] = useState([])
    const search = useSelector(state => state.search.query?.toLowerCase())

    useEffect(()=>
    {
        async function fetchBooks() {
            const data = await getBooks()
            setBooks(data)
        }
        fetchBooks()
    }, [])

    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.publisher?.toLowerCase().includes(search)
    )

    return(

        <>
            <h1>Catalog</h1>
            <SearchBar/>
            <div>
                {filteredBooks.map(book => (
                    <div key={book.id}>
                        <img src={book.image} alt={book.title} />
                        <h2>{book.title}</h2>
                        <p>{book.author}</p>
                        <p>{book.description}</p>
                        <p>{book.category}</p>
                        <p>{book.rating}</p>
                    </div>
                ))}
            </div>
        </>
    )
}