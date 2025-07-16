import Link from 'next/link'
import './footer.css'

export default function Footer() {

    return(
        <>
        <footer className="flex-wrap    ">
            <div className="d-flex footer-wrap flex-wrap">
                <div className="column ">
                    <p>Literria</p>
                </div>
                <div className="column ">
                    <p>Website created by Charlotte Smit for educational purposes.</p>
                </div>
                <div className="column footer-links d-flex gap-3 ">
                    <Link href="/catalog">Catalog</Link>
                    <Link href="/auth">Sign in / up</Link>
                </div>
                <div className="column  footer-socials">

                </div>
            </div>
        </footer>
        </>
    )
}