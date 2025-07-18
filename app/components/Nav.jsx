'use client'

import "./nav.css"
import HoverWord from './HoverWord'
import Link from "next/link"
import SearchBar from '@/app/components/SearchBar'
import { useEffect, useState } from "react"
import { selectQuantity } from "@/store/slices/panierSlice"
import { useSelector } from "react-redux"
import { useSession, signOut } from 'next-auth/react'


export default function Nav() {

    const qtTotale = useSelector(selectQuantity)

    const [scrolled, setScrolled] = useState(false)

    const { data: session } = useSession()

    const [hasMounted, setHasMounted] = useState(false)




    useEffect(() => {

        setHasMounted(true)

        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)

        return() => window.removeEventListener('scroll', handleScroll)
    }, [])

    return(
        <>
            <nav className={`d-flex gap-3 ${scrolled ? 'scrolled' : ''}`}>
                <div className="div-titre ">
                    <h1 className="titre ">
                        <Link href="/"><HoverWord word="Literria" animate={true} /></Link>
                    </h1>
                </div>
                <div className="wrap gap-5 flex-wrap">
                    <div className="div-links ">
                        {/* <div className="div-catalog ">
                        </div> */}
                        <div className="nav-links">
                            <Link href="/catalog"><p>CATALOG</p></Link>
                            <Link href="/cart"><p>CART[<span>{hasMounted ? qtTotale : 0}</span>]</p></Link>
                            <Link href="/account"><p>MY ORDERS</p></Link>
                        </div>
                    </div>
                    <div className="div-log d-flex flex-column align-items-end ">
                        {/* <div className="div-catalog">
                        </div> */}
                        <div className="sign-in d-flex flex-column gap-3 ">
                            {/* <Link href="/auth"><p role="button">SIGN IN</p></Link> */}
                            { session ?
                            <p role="button" onClick={()=>signOut()}>LOG OUT</p>
                            :
                            <Link href="/auth"><p role="button">LOG IN</p></Link>
                            }
                            {/* <div className="">
                                <SearchBar/>
                            </div> */}
                            {/* <p>SIGN <span>I</span>N</p> */}
                        </div>
                    </div>
                </div>
                {/* Sur mobiles */}
                <div className="wrap2 justify-content-between w-100">
                            <Link href="/catalog"><p>CATALOG</p></Link>
                            <Link href="/cart"><p>CART[<span>{hasMounted ? qtTotale : 0}</span>]</p></Link>
                            <Link href="/account"><p>MY ORDERS</p></Link>
                                                { session ?
                            <p role="button" onClick={()=>signOut()}>LOG OUT</p>
                            :
                            <Link href="/auth"><p role="button">LOG IN</p></Link>
                            }
                    {/* <p>CATALOG</p>
                    <p>CART[0]</p>
                    <p>MY ACCOUNT</p>
                    <p>SIGN IN</p> */}
                </div>
            </nav>
        </>
    )
}