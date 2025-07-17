'use client'

import { clearCart, deleteBook, selectQuantity } from "@/store/slices/panierSlice";
import './cart.css'
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Cart() {

    const dispatch = useDispatch()
    const router = useRouter()

    const { data: session } = useSession()

    const cartItems = useSelector(state => state.panier)

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
    //  empty array => la valeur initiale du reduce : un empty array qu'on va ensuite accumuler. il faut faire en sorte que ce soit un array vide car on va utiliser la méthode FIND dessus => il faut un array d'objets et pas un objet, s'il n'y avait pas cette précision par défaut react prendrait le premier item de cartItem (un objet).

    // total du panier :
    const total = cartItems.reduce((total, currentValue) => total = total + currentValue.price
    , 0)

    // total quantité:
    const qtTotale = useSelector(selectQuantity)

    // si pas de session, s'enregistrer
    const handleCheckout = async() => {
        if (!session) {
            router.push('/auth')
            return
        }
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: cartItems,
                    total: total
                })
            })

            if (response.ok) {
                const data = await response.json()
            
                
                router.push('/orders')
            }
            } catch (error) {
            console.error("Checkout error:", error)
            }
            }

    return (

        <>
        <h3 className="cart-title">Cart</h3>
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
                              <p className="p-0 m-0">{item.price}</p>
                            </div>
                            <div className="">
                              <p className="p-0 m-0">{item.price*item.quantity}</p>
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
                            <div className="d-flex justify-content-between  m-0 p-0 align-items-center">
                                <p className="p-0 m-0">Total quantity</p>
                                <p className="p-0 m-0">{qtTotale}</p>
                            </div>
                            <div className="d-flex justify-content-between  m-0 p-0 align-items-center">
                                <p className="p-0 m-0">Total to pay</p>
                                <p className="p-0 m-0">{total.toFixed(2)}</p>
                            </div>
                        </div> 
                        <input className="input-coupon m-0 p-0" placeholder="Enter your coupon code" />
                        <button onClick={handleCheckout}>Commander</button>
                    </div>

                {/* <div>
                    <div className="d-flex justify-content-between  m-0 p-0 align-items-center">
                        <p className="p-0 m-0">Total quantity</p>
                        <p className="p-0 m-0">{qtTotale}</p>
                    </div>
                    <div>
                        <input type="text" className="input-coupon m-0 p-0" placeholder="Enter your coupon code" />
                    </div>
                    <div className="d-flex justify-content-between  m-0 p-0 align-items-center">
                        <p>Total</p>
                        <p>{total}</p>
                    </div>
                </div>

                <div>
                    <button
                    onClick={handleCheckout}>Commander</button>
                </div> */}
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