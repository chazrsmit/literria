import "./nav.css"
import Image from 'next/image'
import log from '../../public/assets/login-03.svg'

export default function Nav() {

    return(
        <>
            <nav className="d-flex">
                <div className="div-titre justify-content-end ">
                    <h1 className="titre "><span>L</span>it<span>e</span>r<i>r</i>i<span>a</span></h1>
                </div>
                <div className="wrap d-flex gap-5 flex-wrap border">
                    <div className="div-links border">
                        {/* <div className="div-catalog ">
                        </div> */}
                        <div className="nav-links ">
                            <p className="">CATALOG</p>

                            <p className="">FAVES[0]</p>

                            <p className="">CART[0]</p>
                        </div>
                    </div>
                    <div className="div-log d-flex flex-column align-items-end border">
                        {/* <div className="div-catalog">
                        </div> */}
                        <div className="">
                            <p>SIGN <span>I</span>N</p>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}