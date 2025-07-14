'use client'

import { deleteBook } from "@/store/slices/panierSlice";
import './cart.css'
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const dispatch = useDispatch()

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

    return(

        <>
        <div>
            {itemGroup.map(item =>
                <div key={item.id}>
                    <p>{item.title}</p>
                    <p>{item.quantity}</p>
                    <button onClick={() => dispatch(deleteBook(item.id))}>Delete book</button>
                </div>
            )}
        </div>
        </>

    )
}