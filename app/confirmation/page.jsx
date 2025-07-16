'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '@/store/slices/panierSlice'
import { useSession } from 'next-auth/react'

export default function Confirmation() {
    const dispatch = useDispatch()
    const delivery = useSelector((state) => state.delivery)
    const cartItems = useSelector((state) => state.panier)

    const [deliveryDate, setDeliveryDate] = useState('')
    const [groupedItems, setGroupedItems] = useState([])

   useEffect(() => {
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

  const total = grouped.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const finalizeOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: grouped,
          total,
        }),
      })

      if (!res.ok) {
        console.error('Failed to save order')
      }
    } catch (err) {
      console.error('Error finalizing order:', err)
    }
  }

  finalizeOrder()
  dispatch(clearCart())
}, [])


    const fullAddress = `${delivery.address}, ${delivery.city}, ${delivery.country}`
    const fullName = delivery.fullName

    return (
        <div>
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
