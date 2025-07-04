import "./nav.css"

export default function Nav() {

    return(
        <>
            <nav className="d-flex">
                <div className="div-titre">
                    <h1 className="titre">Liter<i>r</i>ia</h1>
                </div>
                <div className="div-links d-flex flex-column justify-content-center align-items-center">
                    <p className="m-0">CATALOG</p>
                    <p className="m-0">FAVES[0]</p>
                    <p className="m-0">CART[0]</p>
                </div>
                <div className="div-log d-flex align-items-center justify-content-end">
                    <p>Log In</p>
                </div>
            </nav>
        </>
    )
}