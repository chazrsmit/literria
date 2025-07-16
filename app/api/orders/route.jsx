import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createOrder, getUserOrders } from '@/app/lib/orders'
import { authOptions } from '../auth/[...nextauth]/route'

// GET - Retrieve user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email
    const userEmail = session.user.email

    const orders = getUserOrders(userId, userEmail)

    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )

    return NextResponse.json(sortedOrders)
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}

// POST - Create new order (only after payment is successful)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { cartItems, total } = await request.json()

    if (!cartItems || cartItems.length === 0 || !total) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const userId = session.user.id || session.user.email
    const userEmail = session.user.email
    const userName = session.user.name

    // 👇 Order is created ONLY after fake payment has been "processed"
    const order = await createOrder(userId, userEmail, userName, cartItems, total)

    return NextResponse.json(
      { message: 'Order completed', order },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    )
  }
}
