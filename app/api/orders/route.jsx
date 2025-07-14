import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createOrder, getUserOrders } from '@/lib/orders'
import { authOptions } from '../auth/[...nextauth]/route'

// GET - Retrieve user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id || session.user.email
    const userEmail = session.user.email
    
    const orders = getUserOrders(userId, userEmail)
    
    // Sort orders by creation date (newest first)
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
    
    return NextResponse.json(sortedOrders)
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const { cartItems, total } = await request.json()
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }
    
    const userId = session.user.id || session.user.email
    const userEmail = session.user.email
    const userName = session.user.name
    
    const order = await createOrder(userId, userEmail, userName, cartItems, total)
    
    return NextResponse.json(
      { message: 'Commande créée avec succès', order },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}