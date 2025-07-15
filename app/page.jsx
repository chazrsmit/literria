'use client'

import './catalog.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBooks } from '@/app/lib/getBooks'
import SearchBar from '@/app/components/SearchBar'
import { loadMore, resetPagination } from '../../store/slices/paginationSlice'
import Link from 'next/link'
import { addBook } from '@/store/slices/panierSlice'

export default function Home() {

    const [books, setBooks] = useState([])
    const dispatch = useDispatch()
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


  return (
    <>

        {/* Sélection de 4 livres (aléatoire) en caroussel - livres du moment */}


        {/* Sélection de 4 livres (catégorie A, B ou C includes "poetry") + un bouton view more qui va nous amener sur la page catalog avec le filtre category "poetry"*/}

        {/* idem pour 4 livres de la catégorie "science fiction" */}

    </>
  )
}
