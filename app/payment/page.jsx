'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
        <div className="max-w-md mx-auto mt-10">
            <h2>Payment</h2>
            <form onSubmit={handlePayment} className="flex flex-col gap-3 mt-4">
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
                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}
