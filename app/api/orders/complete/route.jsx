import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createOrder } from '@/app/lib/orders'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cartItems, total } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const userId = session.user.id || session.user.email
    const userEmail = session.user.email
    const userName = session.user.name

    const order = await createOrder(userId, userEmail, userName, cartItems, total)

    return NextResponse.json({ message: 'Order created', order }, { status: 201 })

  } catch (error) {
    console.error('Error finalizing order:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
