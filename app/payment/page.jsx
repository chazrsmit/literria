'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '../cart/cart.css'
import '../homepage.css'
import './payment.css'
import Link from 'next/link'


export default function PaymentPage() {
    const router = useRouter()

    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')

    const handlePayment = (e) => {
        e.preventDefault()

        if (!cardName || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all fields')
            return
        }

        // Simulate payment delay
        setTimeout(() => {
            router.push('/confirmation')
        }, 1500)
    }

    return (
        <>
        <h3 className="cart-title mb-2">Payment details</h3>
        <div className="page-cart">
            <form onSubmit={handlePayment} className="payment-form">
                <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                />
                <div className="d-flex justify-content-between mt-2">
                    <Link href="/orders"><button className="view-more-section-btn mt-2">back to delivery</button></Link>
                    <button type="submit" className="view-more-section-btn wider mt-2">pay now</button>
                </div>
            </form>
        </div>
    </>
    )
}
