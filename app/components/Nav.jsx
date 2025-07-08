'use client'

import "./nav.css"
import HoverWord from './HoverWord'
import Link from "next/link"

export default function Nav() {

    return(
        <>
            <nav className="d-flex gap-3 ">
                <div className="div-titre ">
                    <h1 className="titre ">
                        <Link href="/"><HoverWord word="Literria" animate={true} /></Link>
                    </h1>
                </div>
                <div className="wrap gap-5 flex-wrap ">
                    <div className="div-links ">
                        {/* <div className="div-catalog ">
                        </div> */}
                        <div className="nav-links ">
                            <Link href="/catalog"><p role="button">CATALOG</p></Link>
                            <p role="button">CART[0]</p>
                            <p role="button">MY ACCOUNT</p>
                        </div>
                    </div>
                    <div className="div-log d-flex flex-column align-items-end">
                        {/* <div className="div-catalog">
                        </div> */}
                        <div className="">
                            <HoverWord word="SIGN IN" />
                            {/* <p>SIGN <span>I</span>N</p> */}
                        </div>
                    </div>
                </div>
                {/* Sur mobiles */}
                <div className="wrap2 gap-5 justify-content-between w-100">
                    <HoverWord word="CATALOG" />
                    <HoverWord word="CART[0]" />
                    <HoverWord word="MY ACCOUNT" />
                    <HoverWord word="SIGN IN" />
                    {/* <p>CATALOG</p>
                    <p>CART[0]</p>
                    <p>MY ACCOUNT</p>
                    <p>SIGN IN</p> */}
                </div>
            </nav>
        </>
    )
}