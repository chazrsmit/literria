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
import '../../cart/cart.css'

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

                {/* <div className="category-header d-flex justify-content-between align-items-center w-100 gap-2">
                    <h5 className="p-0 m-0 d-flex align-items-center">Books in category: {categoryName} ({filteredBooks.length} books found)</h5>
                    <Link href="/catalog">
                        <button className="back-btn">← Back to All Books</button>
                    </Link>
                </div>

                <SearchBar /> */}

             <div className="d-flex justify-content-between mb-2">
                <div className="">
                    <div>
                        <h3 className="cart-title">{categoryName} ({filteredBooks.length} books found)</h3>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <SearchBar />
                </div>
            </div>   

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
                                                        <div className='d-flex gap-2 mt-1 mb-2'>
                                <Link href={`/category/${encodeURIComponent(book.categoryA)}`}>
                                    <button>{book.categoryA}</button>
                                </Link>
                                <Link href={`/category/${encodeURIComponent(book.categoryB)}`}>
                                    <button>{book.categoryB}</button>
                                </Link>
                                {book.categoryC && (
                                    <Link href={`/category/${encodeURIComponent(book.categoryC)}`}>
                                        <button>{book.categoryC}</button>
                                    </Link>
                                )}
                            </div>
                            <p className="book-description">{book.description}</p>
                            {/* Price */}
                            <div className="d-flex mt-2 mb-1 gap-2">
                                {book.discountedPrice ?
                                <>
                                <p className="card-book-price">{book.price}€</p>
                                <p className="card-book-price discounted">-10%</p>
                                <p className="card-book-price promotion">{book.discountedPrice}€</p>
                                </>
                                :
                                <p className="card-book-price">{book.price}€</p>
                                }
                                <button
                                onClick={() => dispatch(addBook(book))}
                                className='btn-add-cart'
                                >Add to cart</button>
                            </div>
                            {/* Bouton vers la page détails */}
                            <Link href={`/details/${book.id}`}>
                                <button className="btn-view-more">view more</button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Load more */}
                {hasMoreBooks && (
                    <div className="view-more-container">
                        <button
                            className="load-more-btn"
                            onClick={handleLoadMore}
                        >
                            Load More ({filteredBooks.length - displayCount})
                        </button>
                    </div>
                )}

                {filteredBooks.length === 0 && (
                    <div className="no-books">
                        <p></p>
                    </div>
                )}
            </div>
        </>
    )
}