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

    const itemGroup = cartItems.reduce((newArray, book) => {
        // on check si le livre existe déjà dans le cart
        const existe = newArray.find(i => i.id === book.id)

        if (existe) {
            existe.quantity += 1
        }
        else {
            // on crée un nouvel objet
            newArray.push({...book, quantity: 1})
        }
        return newArray
    }, [])

    // Promotion logic: 4+1 free (cheapest book free when 5+ books)
    const calculatePromotionDiscount = () => {
        const totalBooks = cartItems.length
        if (totalBooks >= 5) {
            // Find the cheapest book
            const sortedByPrice = [...cartItems].sort((a, b) => a.price - b.price)
            const cheapestBook = sortedByPrice[0]
            
            // Calculate how many free books (one free book per 5 books)
            const freeBooks = Math.floor(totalBooks / 5)
            
            return {
                discount: cheapestBook.price * freeBooks,
                freeBooks: freeBooks,
                cheapestBookPrice: cheapestBook.price,
                cheapestBookTitle: cheapestBook.title
            }
        }
        return { discount: 0, freeBooks: 0, cheapestBookPrice: 0, cheapestBookTitle: '' }
    }

    const promotion = calculatePromotionDiscount()

    // total du panier (original):
    const originalTotal = cartItems.reduce((total, currentValue) => total = total + currentValue.price, 0)
    
    // total après promotion:
    const finalTotal = originalTotal - promotion.discount

    // total quantité:
    const qtTotale = useSelector(selectQuantity)

    // si pas de session, s'enregistrer
    const handleCheckout = async() => {
        if (!session) {
            router.push('/auth')
            return
        }
        
        // Store order data in Redux for the checkout process
        const orderData = {
            cartItems: cartItems,
            originalTotal: originalTotal,
            discount: promotion.discount,
            finalTotal: finalTotal,
            promotion: promotion
        }
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: cartItems,
                    total: finalTotal
                })
            })

            if (response.ok) {
                const data = await response.json()
                // Store order data for the checkout process
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
                    <div className=""></div>
                    <div className="">
                        <p>Product</p>
                    </div>
                    <div className="">
                        <p>Quantity</p>
                    </div>
                    <div className="">
                        <p>Price</p>
                    </div>
                    <div className="">
                        <p>Subtotal</p>
                    </div>
                    <div className="">
                    </div>
                </div>
                {/* Mapping des éléments mis dans le cart */}
                <div>
                    {itemGroup.map(item =>
                        <div key={item.id} className="cart-grid cart-product">
                            <div className=" ">
                                <img className="img-cart" src={item.image} alt="" />
                            </div>
                            <div className="">
                                <p className="p-0 m-0">{item.title}</p>
                            </div>
                            <div className="">
                                <p className="p-0 m-0">{item.quantity}</p>
                            </div>
                            <div className="">
                              <p className="p-0 m-0">{item.price}€</p>
                            </div>
                            <div className="">
                              <p className="p-0 m-0">{item.price*item.quantity}€</p>
                            </div>
                            <div className="">
                                <button onClick={() => dispatch(deleteBook(item.id))}>X</button>
                            </div>
                        </div>
                    )}
                </div>

                {
                    cartItems.length > 0 &&
                <>
                      <div className="cart-footer">
                        <div className="cart-totals">
                            <div className="d-flex justify-content-between  m-0 p-0 align-items-center total1">
                                <p className="p-0 m-0">Total quantity</p>
                                <p className="p-0 m-0">{qtTotale}</p>
                            </div>
                            
                            {/* Show promotion details if applicable */}
                            {promotion.freeBooks > 0 && (
                                <div className="promotion-section">
                                    <div className="d-flex justify-content-between m-0 p-0 align-items-center promotion-info">
                                        <p className="p-0 m-0 discount">
                                            ❭ Above 5 books, a 4+1 free discount is applied!
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between m-0 p-0 align-items-center">
                                        <p className="p-0 m-0" style={{fontSize: '0.9em'}}>
                                            {promotion.freeBooks} free book(s): "{promotion.cheapestBookTitle}"
                                        </p>
                                        <p className="p-0 m-0 discount">
                                            -{promotion.discount.toFixed(2)}€
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="d-flex justify-content-between  m-0 p-0 align-items-center">
                                <p className="p-0 m-0">Subtotal</p>
                                <p className="p-0 m-0">{originalTotal.toFixed(2)}€</p>
                            </div>
                            
                            {promotion.discount > 0 && (
                                <div className="d-flex justify-content-between  m-0 p-0 align-items-center">
                                    <p className="p-0 m-0 discount">❭ Discount</p>
                                    <p className="p-0 m-0 discount">-{promotion.discount.toFixed(2)}€</p>
                                </div>
                            )}
                            
                            <div className="d-flex justify-content-between  m-0 p-0 align-items-center total2">
                                <p className="p-0 m-0"><strong>Total to pay</strong></p>
                                <p className="p-0 m-0"><strong>{finalTotal.toFixed(2)}€</strong></p>
                            </div>
                        </div> 
                        {/* <input className="input-coupon m-0 p-0" placeholder="Enter your coupon code" /> */}
                        <button onClick={handleCheckout} className="view-more-section-btn mt-2">order</button>
                    </div>
                </>
                }

                {cartItems.length === 0 &&
                <div>
                    <p>Your cart is empty.</p>
                </div>
                }
            </div>
        </div>
        </>

    )
}