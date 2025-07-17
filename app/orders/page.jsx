'use client'

import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setDeliveryDetails } from '@/store/slices/deliverySlice'
import '../cart/cart.css'
import './orders.css'
import '../homepage.css'
import Link from 'next/link'


export default function Orders() {
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [nbr, setNbr] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')

    const router = useRouter()
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!address || !nbr || !city || !country) {
            alert('Please fill in all fields')
            return
        }

        const fullAddress = `${nbr} ${address}`
        
        dispatch(setDeliveryDetails({
            fullName,
            address: fullAddress,
            city,
            postalCode: '', 
            country,
        }))

        router.push('/payment')
    }

    return (
        <>
    <h3 className="cart-title mb-2">Delivery details</h3>
        <div className="page-cart">
            <form onSubmit={handleSubmit} className="delivery-form">
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                />
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Name"
                />
                <input
                    type="number"
                    value={nbr}
                    onChange={(e) => setNbr(e.target.value)}
                    placeholder="Street Number"
                />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                />
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                />
                <div className="d-flex justify-content-between mt-2">
                    <Link href="/cart"><button className="view-more-section-btn mt-2">back to cart</button></Link>
                    <button type="submit" className="view-more-section-btn wider mt-2">proceed to payment</button>
                </div>
            </form>
        </div>
        </>
    )
}
