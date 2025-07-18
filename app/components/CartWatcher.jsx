'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCartItems, selectOrderData } from '@/store/slices/panierSlice'

export default function CartWatcher() {
  const cartItems = useSelector(selectCartItems)
  const orderData = useSelector(selectOrderData)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orderData', JSON.stringify(orderData))
    }
  }, [orderData])

  return null
}
