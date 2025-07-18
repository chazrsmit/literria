import Link from 'next/link'
import './footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-wrap">
                <div className="column">
                    <p>Literria</p>
                </div>
                <div className="column">
                    <p>Website created by Charlotte Smit for educational purposes.</p>
                </div>
                <div className="column footer-socials">
                    <a 
                        href="https://www.linkedin.com/in/ch-smit" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5c0 1.38-1.12 2.5-2.5 2.5S0 4.88 0 3.5 1.12 1 2.5 1s2.5 1.12 2.5 2.5zM0 8.98h5v15.02H0V8.98zM7.98 8.98h4.8v2.05h.07c.67-1.28 2.3-2.63 4.73-2.63 5.06 0 6 3.33 6 7.66v8.02h-5V16.5c0-1.54-.03-3.52-2.15-3.52-2.15 0-2.48 1.68-2.48 3.4v7.62h-5V8.98z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
