'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, clearOrderData, selectOrderData } from '@/store/slices/panierSlice'
import { useRouter } from 'next/navigation'
import '../homepage.css'
import "../cart/cart.css"
import './confirmation.css'

export default function Confirmation() {
  const dispatch = useDispatch()
  const router = useRouter()
  const delivery = useSelector((state) => state.delivery)
  const orderData = useSelector(selectOrderData)
  const cartItems = useSelector((state) => state.panier.items)

  const [deliveryDate, setDeliveryDate] = useState('')
  const [groupedItems, setGroupedItems] = useState([])
  const [finalOrderData, setFinalOrderData] = useState(null)

  useEffect(() => {
    console.log('=== CONFIRMATION DEBUG ===')
    console.log('Redux orderData:', orderData)
    console.log('Redux cartItems:', cartItems)
    
    // Try to get order data from localStorage as backup
    let localStorageData = null
    try {
      const stored = localStorage.getItem('orderData')
      localStorageData = stored ? JSON.parse(stored) : null
      console.log('localStorage orderData:', localStorageData)
    } catch (error) {
      console.error('Error reading localStorage:', error)
    }

    // Use Redux data first, then localStorage as fallback
    const dataToUse = orderData || localStorageData
    console.log('Final data to use:', dataToUse)

    if (!dataToUse || !dataToUse.cartItems || dataToUse.cartItems.length === 0) {
      console.error('No order data found anywhere!')
      
      // Don't redirect immediately, show debug info
      return
    }

    setFinalOrderData(dataToUse)

    // Group items from order data
    const grouped = dataToUse.cartItems.reduce((acc, item) => {
      const existing = acc.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity += 1
      } else {
        acc.push({ ...item, quantity: 1 })
      }
      return acc
    }, [])

    console.log('Grouped items for display:', grouped)
    setGroupedItems(grouped)

    // Set estimated delivery date to 3 days from now
    const estimated = new Date()
    estimated.setDate(estimated.getDate() + 3)
    setDeliveryDate(estimated.toDateString())

    // Clear cart after successful display
    dispatch(clearCart())
    
  }, [orderData, dispatch])

  // If no order data, show debug info instead of redirecting
  if (!finalOrderData) {
    return (
      <>
        <h3 className="cart-title mb-2">Confirmation</h3>
        <div className="page-confirmation">
          <p className="empty-car m-0 p-0">Debug Information</p>
          
          <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
            <h4>Debug Info:</h4>
            <p><strong>Redux orderData:</strong> {orderData ? 'Found' : 'Not found'}</p>
            <p><strong>Redux cartItems:</strong> {cartItems ? cartItems.length : 'undefined'}</p>
            <p><strong>localStorage orderData:</strong> {localStorage.getItem('orderData') ? 'Found' : 'Not found'}</p>
            
            <h5>Full State:</h5>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify({ orderData, cartItems }, null, 2)}
            </pre>
            
            <h5>localStorage Content:</h5>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {localStorage.getItem('orderData') || 'No data in localStorage'}
            </pre>
          </div>
          
          <button 
            onClick={() => router.push('/cart')} 
            className="view-more-section-btn mt-2"
          >
            Back to Cart
          </button>
        </div>
      </>
    )
  }

  const fullAddress = delivery ? `${delivery.address}, ${delivery.city}, ${delivery.country}` : 'Address not found'
  const fullName = delivery ? delivery.fullName : 'Customer'

  return (
    <>
      <h3 className="cart-title mb-2">Confirmation</h3>
      <div className="page-confirmation">
        <p className="empty-car m-0 p-0">Thank you, payment successful!</p>
        <p className="empty-car m-0 p-0">You bought:</p>
          <ul>
            {groupedItems.map((item) => (
              <li key={item.id} className="empty-car">
                {item.title} × {item.quantity}
                <span className="">
                  &nbsp;({((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)} €)
                </span>
              </li>
            ))}
          </ul>
        <p className="empty-car m-0 p-0">And paid a total of {finalOrderData.finalTotal.toFixed(2)}€.</p>
        <p className="empty-car m-0 p-0">You will receive your books at {fullAddress} on {deliveryDate} (approximative date).</p>
          
          {/* Show promotion info if applicable */}
          {/* {finalOrderData.promotion && finalOrderData.promotion.freeBooks > 0 && (
            <div className="promotion-section mt-4">
              <p className="discount">
                ❭ 4+1 free discount applied: {finalOrderData.promotion.freeBooks} free book(s)
              </p>
              <p className="discount">
                "{finalOrderData.promotion.cheapestBookTitle}" - {finalOrderData.promotion.discount.toFixed(2)}€
              </p>
            </div>
          )} */}

          {/* <div className="mt-4">
            <p><strong>Subtotal:</strong> {finalOrderData.originalTotal.toFixed(2)}€</p>
            {finalOrderData.discount > 0 && (
              <p className="discount"><strong>Discount:</strong> -{finalOrderData.discount.toFixed(2)}€</p>
            )}
            <p><strong>Total Paid:</strong> {finalOrderData.finalTotal.toFixed(2)}€</p>
          </div>

        <ul>
          <li>{fullName}</li>
          <li>{fullAddress}</li>
          <li>Estimated delivery: {deliveryDate}</li>
        </ul> */}

        <div className="mt-4">
          <iframe
            width="100%"
            height="300"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
          ></iframe>
        </div>
      </div>
    </>
  )
}