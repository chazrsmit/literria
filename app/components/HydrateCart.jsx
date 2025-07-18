'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCart, setOrderData } from '@/store/slices/panierSlice'

export default function HydrateCart() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      dispatch(setCart(cart))
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e)
    }

    try {
      const order = JSON.parse(localStorage.getItem('orderData'))
      if (order) dispatch(setOrderData(order))
    } catch (e) {
      console.error('Failed to load orderData from localStorage:', e)
    }
  }, [dispatch])

  return null
}
