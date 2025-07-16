import Link from 'next/link'
import './footer.css'

export default function Footer() {

    return(
        <>
        <footer>
            <div className="d-flex footer-wrap flex-wrap">
                <div className="col-3 ">
                    <p>Literria</p>
                </div>
                <div className="col-3 ">
                    <p>Website created by Charlotte Smit for educational purposes.</p>
                </div>
                <div className="col-3 footer-links d-flex gap-3 ">
                    <Link href="/catalog">Catalog</Link>
                    <Link href="/auth">Sign in / up</Link>
                </div>
                <div className="col-3  footer-socials">

                </div>
            </div>
        </footer>
        </>
    )
}