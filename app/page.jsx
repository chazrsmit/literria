'use client'

import './homepage.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBooks } from '@/app/lib/getBooks'
import SearchBar from '@/app/components/SearchBar'
import Link from 'next/link'
import { addBook } from '@/store/slices/panierSlice'
import './cart/cart.css'

export default function Home() {
    const [books, setBooks] = useState([])
    const [currentSlide, setCurrentSlide] = useState(0)
    const [randomBooks, setRandomBooks] = useState([])
    const [poetryBooks, setPoetryBooks] = useState([])
    const [sciFiBooks, setSciFiBooks] = useState([])
    const [isCarouselEnabled, setIsCarouselEnabled] = useState(false)
    const dispatch = useDispatch()
    const search = useSelector(state => state.search.query?.toLowerCase())

        // Check screen size for carousel functionality
    useEffect(() => {
        const checkScreenSize = () => {
            setIsCarouselEnabled(window.innerWidth >= 720)
        }
        
        // Check on mount
        checkScreenSize()
        
        // Add resize listener
        window.addEventListener('resize', checkScreenSize)
        
        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    useEffect(() => {
        async function fetchBooks() {
            const data = await getBooks()
            console.log(data)
            setBooks(data)
        }
        fetchBooks()
    }, [])

    // Function to get random books
    const getRandomBooks = (booksArray, count) => {
        // Step 1: Create a copy to avoid modifying original array
        const booksCopy = [...booksArray]
        
        // Step 2: Shuffle the copy using Fisher-Yates algorithm (more reliable)
        for (let i = booksCopy.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1))
            // Swap elements
            const temp = booksCopy[i]
            booksCopy[i] = booksCopy[randomIndex]
            booksCopy[randomIndex] = temp
        }
        
        // Step 3: Return only the first 'count' books
        return booksCopy.slice(0, count)
    }

    // Function to get books by category
    const getBooksByCategory = (category, count) => {
        const categoryBooks = books.filter(book => 
            book.categoryA?.toLowerCase().includes(category.toLowerCase()) ||
            book.categoryB?.toLowerCase().includes(category.toLowerCase()) ||
            book.categoryC?.toLowerCase().includes(category.toLowerCase())
        )
        return getRandomBooks(categoryBooks, count)
    }

    // Set book selections only when books data changes (on page load/refresh)
    useEffect(() => {
        if (books.length > 0) {
            setRandomBooks(getRandomBooks(books, 4))
            setPoetryBooks(getBooksByCategory('poetry', 4))
            setSciFiBooks(getBooksByCategory('science fiction', 4))
        }
    }, [books])

    // Carousel functionality
    const nextSlide = () => {
        if (isCarouselEnabled) {
            setCurrentSlide((prev) => (prev + 1) % randomBooks.length)
        }
    }

    const prevSlide = () => {
        if (isCarouselEnabled) {
            setCurrentSlide((prev) => (prev - 1 + randomBooks.length) % randomBooks.length)
        }
    }

   // Auto-advance carousel only for screens 720px and above
    useEffect(() => {
        if (randomBooks.length > 0 && isCarouselEnabled) {
            const interval = setInterval(nextSlide, 5000)
            return () => clearInterval(interval)
        }
    }, [randomBooks.length, isCarouselEnabled])

    // Reset slide position when carousel is disabled
    useEffect(() => {
        if (!isCarouselEnabled) {
            setCurrentSlide(0)
        }
    }, [isCarouselEnabled])


    // Component to render a book card in the carousel
    const BookCardCarousel = ({ book }) => (
        <div className="book2">

            <div className="div-img2">

                    
                                
                    <div className="book-image-wrapper2">
                        <Link href={`/details/${book.id}`}>
                        <img 
                            src={book.image} 
                            alt={book.title}
                        />
                        </Link>
                    </div>
                    

            </div>
            <div className="details">
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
                <div className="d-flex">
                    <p>{book.price}</p>
                    <button onClick={() => dispatch(addBook(book))}>Add to cart</button>
                </div>
                <Link href={`/details/${book.id}`}>
                    <button>View more</button>
                </Link>
            </div>
        </div>
    )

    // Component to render a book card
    const BookCard = ({ book }) => (
        <div className="book">
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

                            {/* Prix */}
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
    )

    return (
        <>

            {/* Carousel - Books of the moment */}
            {/* <div className="d-flex page-title-div">
            </div> */}
            <section className="carousel-section">
                <div className="carousel-container ">
                    <div className="carousel-wrapper">
                        <div 
                            className="carousel-track"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {randomBooks.map((book) => (
                                <div key={`carousel-${book.id}`} className="carousel-slide">
                                    <BookCardCarousel book={book} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Carousel controls */}
                    <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
                        ❬
                    </button>
                    <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
                        ❭
                    </button>
                    
                    {/* Carousel indicators */}
                    {/* <div className="carousel-indicators">
                        {randomBooks.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div> */}
                </div>
            </section>


            {/* Poetry Books Section */}
 
            <section className="books-section">

                <div className="section-header ">
                    <h2 className="section-title">Our Poetry selection</h2>
                    <Link href="/category/poetry">
                        <button className="view-more-section-btn">view more poetry</button>
                    </Link>
                </div>
                <div className="book-rangee">
                    {poetryBooks.map(book => (
                        <BookCard key={`poetry-${book.id}`} book={book} />
                    ))}
                </div>
                {poetryBooks.length === 0 && (
                    <div className="no-books">
                        <p></p>
                    </div>
                )}
            </section>

            {/* Science Fiction Books Section */}
            <section className="books-section mt-5">
                <div className="section-header ">
                    <h2 className="section-title">Our Science Fiction selection</h2>
                    <Link href="/category/science fiction">
                        <button className="view-more-section-btn">view more sci-fi</button>
                    </Link>
                </div>
                <div className="book-rangee">
                    {sciFiBooks.map(book => (
                        <BookCard key={`scifi-${book.id}`} book={book} />
                    ))}
                </div>
                {sciFiBooks.length === 0 && (
                    <div className="no-books">
                        <p></p>
                    </div>
                )}
            </section>


        </>
    )
}