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

            <div>
                {itemGroup.map(item =>
                    <div key={item.id} className="d-flex gap-3">
                        <p>{item.title}</p>
                        <p>{item.quantity}</p>
                        <p>{item.price*item.quantity}</p>
                        <button onClick={() => dispatch(deleteBook(item.id))}>Delete book</button>
                    </div>
                )}
            </div>

            {
                cartItems.length > 0 &&
            <>
            {/* Total */}
            <div>
                <p>{qtTotale}</p>
                <p>{total}</p>
            </div>
            {/* vers le paiement */}
            <div>
                <button
                onClick={handleCheckout}>Commander</button>
            </div>
            </>
            }

            {cartItems.length === 0 &&
            <div>
                <p>Your cart is empty.</p>
            </div>
            }

        </>

    )
}