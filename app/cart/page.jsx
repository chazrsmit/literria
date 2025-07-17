'use client'

import { clearCart, deleteBook, selectQuantity, selectCartItems, setOrderData } from "@/store/slices/panierSlice";
import './cart.css'
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import '../homepage.css'

export default function Cart() {

    const dispatch = useDispatch()
    const router = useRouter()
    const { data: session } = useSession()
    const cartItems = useSelector(selectCartItems)
    const qtTotale = useSelector(selectQuantity)

    // Group items by ID with quantity
    const itemGroup = cartItems.reduce((newArray, book) => {
        const existe = newArray.find(i => i.id === book.id)
        if (existe) {
            existe.quantity += 1
        } else {
            newArray.push({ ...book, quantity: 1 })
        }
        return newArray
    }, [])

    // Calculate total (accounting for discountedPrice and quantity)
    const originalTotal = itemGroup.reduce((total, item) => {
        const price = item.discountedPrice ?? item.price
        return total + price * item.quantity
    }, 0)

    // Promotion logic: 4+1 free
    const calculatePromotionDiscount = () => {
        const totalBooks = cartItems.length
        if (totalBooks >= 5) {
            // Flatten all items based on quantity
            const expandedItems = itemGroup.flatMap(item =>
                Array.from({ length: item.quantity }, () => ({
                    title: item.title,
                    price: item.discountedPrice ?? item.price
                }))
            )

            // Sort and find the N cheapest books (1 per 5 books)
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

    const handleCheckout = async () => {
        if (!session) {
            router.push('/auth')
            return
        }

        const orderData = {
            cartItems,
            originalTotal,
            discount: promotion.discount,
            finalTotal,
            promotion
        }

        try {
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
                const data = await response.json()
                dispatch(setOrderData(orderData))
                router.push('/orders')
            } else {
                console.error("Order failed:", response.status, response.statusText)
            }
        } catch (error) {
            console.error("Checkout error:", error)
        }
    }

    return (
        <>
            <h3 className="cart-title mb-2">Cart</h3>
            <div className="page-cart">
                <div className="cart">
                    <div className="cart-grid cart-header">
                        <div></div>
                        <div><p>Product</p></div>
                        <div><p>Quantity</p></div>
                        <div><p>Price</p></div>
                        <div><p>Subtotal</p></div>
                        <div></div>
                    </div>

                    {/* Cart Items */}
                    <div>
                        {itemGroup.map(item =>
                            <div key={item.id} className="cart-grid cart-product">
                                <div>
                                    <img className="img-cart" src={item.image} alt="" />
                                </div>
                                <div>
                                    <p className="p-0 m-0">{item.title}</p>
                                </div>
                                <div>
                                    <p className="p-0 m-0">{item.quantity}</p>
                                </div>
                                <div>
                                    {item.discountedPrice ? (
                                        <p className="p-0 m-0 striked-price">
                                            <span>{item.price}€</span> {item.discountedPrice}€
                                        </p>
                                    ) : (
                                        <p className="p-0 m-0">{item.price}€</p>
                                    )}
                                </div>
                                <div>
                                    <p className="p-0 m-0">
                                        {((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)}€
                                    </p>
                                </div>
                                <div>
                                    <button onClick={() => dispatch(deleteBook(item.id))}>X</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Footer */}
                    {cartItems.length > 0 && (
                        <div className="cart-footer">
                            <div className="cart-totals">
                                <div className="d-flex justify-content-between m-0 p-0 align-items-center total1">
                                    <p className="p-0 m-0">Total quantity</p>
                                    <p className="p-0 m-0">{qtTotale}</p>
                                </div>

                                {promotion.freeBooks > 0 && (
                                    <div className="promotion-section">
                                        <div className="d-flex justify-content-between m-0 p-0 align-items-center promotion-info">
                                            <p className="p-0 m-0 discount">
                                                ❭ Above 5 books, a 4+1 free discount is applied!
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between m-0 p-0 align-items-center">
                                            <p className="p-0 m-0" style={{ fontSize: '0.9em' }}>
                                                {promotion.freeBooks} free book(s): "{promotion.cheapestBookTitle}"
                                            </p>
                                            <p className="p-0 m-0 discount">
                                                -{promotion.discount.toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between m-0 p-0 align-items-center">
                                    <p className="p-0 m-0">Subtotal</p>
                                    <p className="p-0 m-0">{originalTotal.toFixed(2)}€</p>
                                </div>

                                {promotion.discount > 0 && (
                                    <div className="d-flex justify-content-between m-0 p-0 align-items-center">
                                        <p className="p-0 m-0 discount">❭ Discount</p>
                                        <p className="p-0 m-0 discount">-{promotion.discount.toFixed(2)}€</p>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between m-0 p-0 align-items-center total2">
                                    <p className="p-0 m-0"><strong>Total to pay</strong></p>
                                    <p className="p-0 m-0"><strong>{finalTotal.toFixed(2)}€</strong></p>
                                </div>
                            </div>

                            <button onClick={handleCheckout} className="view-more-section-btn mt-2">order</button>
                        </div>
                    )}

                    {cartItems.length === 0 && (
                        <div>
                            <p>Your cart is empty.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
