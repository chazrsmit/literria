// app/hooks/useLoadOrderData.js
'use client'

import { useEffect, useState } from 'react'

export function useLoadOrderData(orderDataFromRedux) {
  const [finalOrderData, setFinalOrderData] = useState(null)
  const [groupedItems, setGroupedItems] = useState([])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [localStorageOrderData, setLocalStorageOrderData] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let localStorageData = null
    try {
      const stored = localStorage.getItem('orderData')
      localStorageData = stored ? JSON.parse(stored) : null
      setLocalStorageOrderData(stored || null)
    } catch (error) {
      console.error('Error reading localStorage:', error)
    }

    const dataToUse = orderDataFromRedux || localStorageData
    if (!dataToUse || !dataToUse.cartItems || dataToUse.cartItems.length === 0) return

    setFinalOrderData(dataToUse)

    const grouped = dataToUse.cartItems.reduce((acc, item) => {
      const existing = acc.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity += 1
      } else {
        acc.push({ ...item, quantity: 1 })
      }
      return acc
    }, [])

    setGroupedItems(grouped)

    const estimated = new Date()
    estimated.setDate(estimated.getDate() + 3)
    setDeliveryDate(estimated.toDateString())
  }, [orderDataFromRedux])

  return {
    finalOrderData,
    groupedItems,
    deliveryDate,
    localStorageOrderData
  }
}
