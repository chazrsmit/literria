// page pour remplir les infos de livraison + calculer itinéraire

'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Orders() {

    const [address, setAddress] = useState()
    const [nbr, setNbr] = useState()
    const [city, setCity] = useState()
    const [country, setCountry] = useState()

    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!address || !nbr || !city || !country) {
            alert('Please fill in all fields')
            return
        }
        router.push('/payment')
    }


    return(
        <>
            <h2>Order</h2>

            {/* Formulaire avec les infos */}
            <form onSubmit={handleSubmit}>
                <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address" />
                <input type="number" value={nbr} onChange={(e)=>setNbr(e.target.value)} placeholder="Street Number"/>
                <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" />
                <input type="text" value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="Country" />
                <button type="submit">Proceed to payment</button>
            </form>
        </>
    )
}