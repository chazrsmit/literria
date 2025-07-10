'use client'

import './catalog.css'
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
            console.log(data)
            setBooks(data)
        }
        fetchBooks()
    }, [])

    const filteredBooks = books
        .filter(book =>
            book.title?.toLowerCase().includes(search) ||
            book.author?.toLowerCase().includes(search) ||
            book.publisher?.toLowerCase().includes(search))
        .sort((a,b) => a.title.localeCompare(b.title))

    return(

        <>

            <h1>Catalog</h1>
            <SearchBar/>

                <div className="d-flex flex-wrap justify-content-between gap-2">
                    {filteredBooks.map(book => (
                        <div key={book.id} className="book my-4">
                            <div className="div-img">
                                <div className="book-cover" style={{ backgroundImage: `url(${book.image})` }}>
                                    <div className="effect"></div>
                                    <div className="light"></div>
                                </div>
                                {/* <div className="book-inside"></div> */}
                            </div>
                            <h2 className="book-title mt-4">{book.title}</h2>
                            <p className="book-author">{book.author}</p>
                            <p className="book-description">{book.description}</p>
                            <div className='d-flex gap-2'>
                                <button>{book.categoryA}</button>
                                <button>{book.categoryB}</button>
                                <button>{book.categoryC}</button>
                            </div>
                            {/* <p>{book.rating}</p> */}
                        </div>
                    ))}
                </div>

        </>
    )
}