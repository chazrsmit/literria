'use client'

import './catalog.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBooks } from '@/app/lib/getBooks'
import SearchBar from '@/app/components/SearchBar'
import { loadMore, resetPagination } from '../../store/slices/paginationSlice'
import Link from 'next/link'

export default function Catalog() {

    const [books, setBooks] = useState([])
    const dispatch = useDispatch()
    const search = useSelector(state => state.search.query?.toLowerCase())
    const { displayCount, itemsPerPage } = useSelector(state => state.pagination)


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

    // on va display uniquement les livres qui correspondent au compte actuel
    const displayedBooks = filteredBooks.slice(0, displayCount)

    // on check s'il reste encore des livres dans l'API à afficher
    const hasMoreBooks = displayCount < filteredBooks.length
    
    // la fonction pour charger plus de livres
    const handleLoadMore = () => {
        dispatch(loadMore())
    }

    // quand la rehcerche change, il faut reset le count à 0
    useEffect(() => {
        dispatch(resetPagination())
    }, [search, dispatch])

    return(

        <>

            {/* <h1>Catalog</h1> */}
            {/* <SearchBar/> */}
        <div className="page-catalog">
                <div className="book-rangee">
                    {displayedBooks.map(book => (
                        <div key={book.id} className="book">
                            <div className="div-img">
                                <div className="book-image-wrapper">
                                    <img 
                                        src={book.image} 
                                        alt={book.title}
                                />
                                </div>
                            </div>
                            <h2 className="book-title mt-4">{book.title}</h2>
                            <p className="book-author">{book.author}</p>
                            <p className="book-description">{book.description}</p>
                            <div className='d-flex gap-2'>
                                <button>{book.categoryA}</button>
                                <button>{book.categoryB}</button>
                                <button>{book.categoryC}</button>
                            </div>
                            {/* Bouton vers la page détails */}
                            <Link href={`/details/${book.id}`}>
                                <button>View more</button>
                            </Link>
                            {/* <p>{book.rating}</p> */}
                        </div>
                    ))}
                </div>

                {/* view more */}
                {hasMoreBooks && (
                    <div className="view-more-container">
                        <button
                            className="view-more-btn"
                            onClick={handleLoadMore}
                        >
                            + ({filteredBooks.length-displayCount})
                        </button>
                    </div>
                )}
        </div>
        </>
    )
}