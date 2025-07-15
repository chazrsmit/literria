// page où vont être filtrées les différentes catégories 
// presque copie conforme de catalog.jsx

'use client'

import './category.css' // You'll need to create this CSS file
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { getBooks } from '@/app/lib/getBooks'
import SearchBar from '@/app/components/SearchBar'
import { loadMore, resetPagination } from '@/store/slices/paginationSlice'
import Link from 'next/link'
import { addBook } from '@/store/slices/panierSlice'

export default function CategoryPage() {
    const [books, setBooks] = useState([])
    const dispatch = useDispatch()
    const params = useParams()
    const categorySlug = params.slug
    const search = useSelector(state => state.search.query?.toLowerCase())
    const { displayCount, itemsPerPage } = useSelector(state => state.pagination)

    // Decode the category name from URL
    const categoryName = decodeURIComponent(categorySlug)

    useEffect(() => {
        async function fetchBooks() {
            const data = await getBooks()
            setBooks(data)
        }
        fetchBooks()
    }, [])

    // Filter books by category and search
    const filteredBooks = books
        .filter(book => {
            // Check if book belongs to the selected category
            const belongsToCategory = 
                book.categoryA?.toLowerCase() === categoryName.toLowerCase() ||
                book.categoryB?.toLowerCase() === categoryName.toLowerCase() ||
                book.categoryC?.toLowerCase() === categoryName.toLowerCase()
            
            // If there's a search query, also filter by search
            const matchesSearch = !search || 
                book.title?.toLowerCase().includes(search) ||
                book.author?.toLowerCase().includes(search) ||
                book.categoryA?.toLowerCase().includes(search) ||
                book.categoryB?.toLowerCase().includes(search) ||
                book.categoryC?.toLowerCase().includes(search)
            
            return belongsToCategory && matchesSearch
        })
        .sort((a, b) => a.title.localeCompare(b.title))

    // Display only the books that correspond to current count
    const displayedBooks = filteredBooks.slice(0, displayCount)

    // Check if there are more books to display
    const hasMoreBooks = displayCount < filteredBooks.length
    
    // Function to load more books
    const handleLoadMore = () => {
        dispatch(loadMore())
    }

    // Reset pagination when search changes
    useEffect(() => {
        dispatch(resetPagination())
    }, [search, dispatch, categoryName])

    return (
        <>
            <div className="page-catalog">
                <div className="category-header">
                    <h1>Books in category: {categoryName}</h1>
                    <p>{filteredBooks.length} books found</p>
                    <Link href="/catalog">
                        <button className="back-btn">← Back to All Books</button>
                    </Link>
                </div>

                <SearchBar />

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
                                <Link href={`/category/${encodeURIComponent(book.categoryA)}`}>
                                    <button>{book.categoryA}</button>
                                </Link>
                                {book.categoryB && (
                                    <Link href={`/category/${encodeURIComponent(book.categoryB)}`}>
                                        <button>{book.categoryB}</button>
                                    </Link>
                                )}
                                {book.categoryC && (
                                    <Link href={`/category/${encodeURIComponent(book.categoryC)}`}>
                                        <button>{book.categoryC}</button>
                                    </Link>
                                )}
                            </div>
                            {/* Price */}
                            <div className="d-flex">
                                <p>{book.price}</p>
                                <button onClick={() => dispatch(addBook(book))}>Add to cart</button>
                            </div>
                            {/* Button to details page */}
                            <Link href={`/details/${book.id}`}>
                                <button>View more</button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Load more */}
                {hasMoreBooks && (
                    <div className="view-more-container">
                        <button
                            className="view-more-btn"
                            onClick={handleLoadMore}
                        >
                            + ({filteredBooks.length - displayCount})
                        </button>
                    </div>
                )}

                {filteredBooks.length === 0 && (
                    <div className="no-books">
                        <p>No books found in this category.</p>
                    </div>
                )}
            </div>
        </>
    )
}