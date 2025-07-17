'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '@/store/slices/panierSlice'
import { useSession } from 'next-auth/react'

export default function Confirmation() {
  const dispatch = useDispatch()
  const delivery = useSelector((state) => state.delivery)
  const cartItems = useSelector((state) => state.panier.items) // Make sure to get .items

  const [deliveryDate, setDeliveryDate] = useState('')
  const [groupedItems, setGroupedItems] = useState([])

  // Group items and set estimated delivery date when cartItems change
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

    // Set estimated delivery date to 3 days from now
    const estimated = new Date()
    estimated.setDate(estimated.getDate() + 3)
    setDeliveryDate(estimated.toDateString())
  }, [cartItems])

  // Finalize order and clear cart after groupedItems is set (and non-empty)
  useEffect(() => {
    if (groupedItems.length === 0) return

    const total = groupedItems.reduce(
      (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
      0
    )

    const finalizeOrder = async () => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: groupedItems,
            total,
          }),
        })

        if (!res.ok) {
          console.error('Failed to save order')
          return
        }

        // Clear cart only once after order success
        dispatch(clearCart())
      } catch (err) {
        console.error('Error finalizing order:', err)
      }
    }

    finalizeOrder()
  }, [groupedItems, dispatch])

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
