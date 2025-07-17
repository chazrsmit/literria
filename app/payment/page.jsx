'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderData, selectCartItems } from '@/store/slices/panierSlice'
import '../cart/cart.css'
import '../homepage.css'
import './payment.css'
import Link from 'next/link'

export default function PaymentPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector(selectCartItems)

    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = async (e) => {
        e.preventDefault()

        if (!cardName || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all fields')
            return
        }

        console.log('=== PAYMENT DEBUG ===')
        console.log('Cart items at payment:', cartItems)
        console.log('Cart items length:', cartItems.length)

        if (cartItems.length === 0) {
            alert('Your cart is empty')
            router.push('/cart')
            return
        }

        setIsProcessing(true)

        try {
            // Group items by ID with quantity (same logic as cart)
            const itemGroup = cartItems.reduce((newArray, book) => {
                const existe = newArray.find(i => i.id === book.id)
                if (existe) {
                    existe.quantity += 1
                } else {
                    newArray.push({ ...book, quantity: 1 })
                }
                return newArray
            }, [])

            console.log('Grouped items:', itemGroup)

            // Calculate total (same logic as cart)
            const originalTotal = itemGroup.reduce((total, item) => {
                const price = item.discountedPrice ?? item.price
                return total + price * item.quantity
            }, 0)

            // Promotion logic: 4+1 free (same logic as cart)
            const calculatePromotionDiscount = () => {
                const totalBooks = cartItems.length
                if (totalBooks >= 5) {
                    const expandedItems = itemGroup.flatMap(item =>
                        Array.from({ length: item.quantity }, () => ({
                            title: item.title,
                            price: item.discountedPrice ?? item.price
                        }))
                    )

                    const sorted = expandedItems.sort((a, b) => a.price - b.price)
                    const freeBooks = Math.floor(totalBooks / 5)
                    const discountBooks = sorted.slice(0, freeBooks)
                    const totalDiscount = discountBooks.reduce((sum, book) => sum + book.price, 0)

                    return {
                        discount: totalDiscount,
                        freeBooks,
                        cheapestBookPrice: discountBooks[0]?.price ?? 0,
                        cheapestBookTitle: discountBooks[0]?.title ?? ''
                    }
                }
                return { discount: 0, freeBooks: 0, cheapestBookPrice: 0, cheapestBookTitle: '' }
            }

            const promotion = calculatePromotionDiscount()
            const finalTotal = originalTotal - promotion.discount

            // Create order data
            const orderData = {
                cartItems: [...cartItems], // Make a copy
                originalTotal,
                discount: promotion.discount,
                finalTotal,
                promotion
            }

            console.log('Order data being stored:', orderData)

            // Store order data in Redux AND localStorage directly
            dispatch(setOrderData(orderData))
            
            // Also store directly in localStorage as backup
            try {
                localStorage.setItem('orderData', JSON.stringify(orderData))
                console.log('Order data stored in localStorage')
            } catch (error) {
                console.error('Failed to store in localStorage:', error)
            }

            // Verify it was stored
            const storedData = localStorage.getItem('orderData')
            console.log('Verified stored data:', storedData ? JSON.parse(storedData) : 'NOT FOUND')

            // Make API call to create order
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems,
                    total: finalTotal
                })
            })

            if (response.ok) {
                console.log('Order API call successful')
                
                // Double check the data is still there before redirecting
                const finalCheck = localStorage.getItem('orderData')
                console.log('Final check before redirect:', finalCheck ? 'DATA EXISTS' : 'DATA MISSING')
                
                // Simulate payment delay
                setTimeout(() => {
                    console.log('Redirecting to confirmation...')
                    router.push('/confirmation')
                }, 1500)
            } else {
                console.error("Order failed:", response.status, response.statusText)
                alert('Payment failed. Please try again.')
                setIsProcessing(false)
            }
        } catch (error) {
            console.error("Payment error:", error)
            alert('Payment failed. Please try again.')
            setIsProcessing(false)
        }
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
                        disabled={isProcessing}
                    />
                    <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        disabled={isProcessing}
                    />
                    <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        disabled={isProcessing}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        disabled={isProcessing}
                    />
                    <div className="d-flex justify-content-between mt-2">
                        <Link href="/orders">
                            <button 
                                type="button" 
                                className="view-more-section-btn mt-2"
                                disabled={isProcessing}
                            >
                                back to delivery
                            </button>
                        </Link>
                        <button 
                            type="submit" 
                            className="view-more-section-btn wider mt-2"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'pay now'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}