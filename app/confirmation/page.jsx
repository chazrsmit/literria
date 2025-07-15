'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '@/store/slices/panierSlice'

export default function Confirmation() {
    const dispatch = useDispatch()
    const delivery = useSelector((state) => state.delivery)
    const cartItems = useSelector((state) => state.panier)

    const [deliveryDate, setDeliveryDate] = useState('')
    const [groupedItems, setGroupedItems] = useState([])

   useEffect(() => {
    // Group items before clearing cart
    const grouped = cartItems.reduce((acc, item) => {
        const existing = acc.find((i) => i.id === item.id)
        if (existing) {
            existing.quantity += 1
        } else {
            acc.push({ ...item, quantity: 1 })
        }
        return acc
    }, [])

    setGroupedItems(grouped)

    // Calculate delivery date
    const date = new Date()
    date.setDate(date.getDate() + 2)
    setDeliveryDate(date.toDateString())

    // Clear the cart AFTER local copy is made
    dispatch(clearCart())

    // 👇 Empty dependency array ensures this runs ONCE
    }, [])

    const fullAddress = `${delivery.address}, ${delivery.city}, ${delivery.country}`
    const fullName = delivery.fullName

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-4">
            <h2>Payment Successful</h2>

            <p>Thank you {fullName} !</p>

            <p><strong>Shipping to:</strong></p>
            <p>{fullAddress}</p>

            <p><strong>Estimated Delivery:</strong> {deliveryDate}</p>

            <div className="mt-4">
                <iframe
                    width="100%"
                    height="300"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                ></iframe>
            </div>

            <div className="mt-6">
                <h3>Order Recap</h3>
                {groupedItems.length === 0 ? (
                    <p>No items found.</p>
                ) : (
                    <ul>
                        {groupedItems.map((item) => (
                            <li key={item.id} className="py-1 border-b">
                                <strong>{item.title}</strong> × {item.quantity}
                                {item.price && (
                                    <span className="ml-2">
                                        – {(item.price * item.quantity).toFixed(2)} €
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
