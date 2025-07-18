'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCart, setOrderData } from '@/store/slices/panierSlice'

export default function AppInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const cart = localStorage.getItem('cart')
      if (cart) dispatch(setCart(JSON.parse(cart)))
    } catch (err) {
      console.error('Failed to load cart:', err)
    }

    try {
      const orderData = localStorage.getItem('orderData')
      if (orderData) dispatch(setOrderData(JSON.parse(orderData)))
    } catch (err) {
      console.error('Failed to load orderData:', err)
    }
  }, [dispatch])

  return null
}
