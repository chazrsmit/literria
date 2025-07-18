'use client'
// on va réimporter getBooks
import { getBooks } from '@/app/lib/getBooks'
import { use, useEffect, useState } from 'react'
import './details.css'
import { addBook } from '@/store/slices/panierSlice'
import { useDispatch } from 'react-redux'
import '../../catalog/catalog.css'
import Link from 'next/link'


export default function Details({params}) {

    const dispatch= useDispatch()

    const bookParams = use(params)

    const [book, setBook] = useState()
    const [error, setError] = useState(null)

    useEffect(()=>
    {
        async function fetchBook() {
            const book = await getBooks()
            const foundBook = book.find(book => book.id === parseInt(bookParams.id))

            if (foundBook) {
                setBook(foundBook)
            }
            else {
                setError('Loading')
            }
        }
        fetchBook()
    }, [bookParams.id])

    if (!book) return <div><p></p></div>

    return(
        <>
        <div className='page-details d-flex justify-content-center my-5 '>
            <div className="book-details d-flex my-5  justify-content-between">
                {/* Image */}
                <div className="div-img3">
                    <div className="book-image-wrapper3">
                        <img 
                            src={book.image} 
                            alt={book.title}
                    />
                    </div>
                </div>
                {/* Infos */}
                <div className="book-infos">
                    <div className='d-flex gap-2 '>
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
                    <h2 className="title my-2">{book.title}</h2>
                    <h3 className="author">{book.author}</h3>
                    <div className="div-description">
                        <p className="description">{book.description}</p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap ">
                        {book.discountedPrice ?
                        <div className="d-flex gap-2">
                            <p className="card-book-price promotion">{book.discountedPrice}</p>
                            <p className="card-book-price discounted">-10%</p>
                        </div>
                        :
                        <p className="card-book-price">{book.price}</p>}
                        <button onClick={()=>dispatch(addBook(book))}
                        className="btn-add-cart">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}