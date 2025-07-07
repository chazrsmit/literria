'use client'

import "./nav.css"
import HoverWord from './HoverWord'

export default function Nav() {

    return(
        <>
            <nav className="d-flex">
                <div className="div-titre ">
                    <h1 className="titre ">
                        <HoverWord word="Literria" />
                    </h1>
                </div>
                <div className="wrap gap-5 flex-wrap ">
                    <div className="div-links ">
                        {/* <div className="div-catalog ">
                        </div> */}
                        <div className="nav-links ">
                            <p role="button">CATALOG</p>
                            <p role="button">FAVES[0]</p>
                            <p role="button">CART[0]</p>
                        </div>
                    </div>
                    <div className="div-log d-flex flex-column align-items-end ">
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
                    <p>CATALOG</p>
                    <p>FAVES[0]</p>
                    <p>CART[0]</p>
                    <p>SIGN IN</p>
                </div>
            </nav>
        </>
    )
}