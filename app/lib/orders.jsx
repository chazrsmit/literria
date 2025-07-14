import fs from 'fs'
import path from 'path'

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json')

// Ensure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(ordersFilePath)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read orders from file
const readOrders = () => {
  ensureDataDirectory()
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

// Write orders to file
const writeOrders = (orders) => {
  ensureDataDirectory()
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2))
  } catch (error) {
    console.error('Error writing orders:', error)
  }
}

// Create new order
export const createOrder = async (userId, userEmail, userName, cartItems, total) => {
  const orders = readOrders()
  
  // Group cart items (same logic as in your cart)
  const groupedItems = cartItems.reduce((newArray, book) => {
    const existe = newArray.find(i => i.id === book.id)
    if (existe) {
      existe.quantity += 1
    } else {
      newArray.push({...book, quantity: 1})
    }
    return newArray
  }, [])
  
  // Calculate total quantity
  const totalQuantity = groupedItems.reduce((total, item) => total + item.quantity, 0)
  
  // Create new order
  const newOrder = {
    id: Date.now().toString(),
    userId: userId,
    userEmail: userEmail,
    userName: userName,
    items: groupedItems,
    totalAmount: total,
    totalQuantity: totalQuantity,
    status: 'completed',
    createdAt: new Date().toISOString(),
    orderNumber: `ORD-${Date.now()}`
  }
  
  orders.push(newOrder)
  writeOrders(orders)
  
  return newOrder
}

// Get orders by user ID
export const getOrdersByUserId = (userId) => {
  const orders = readOrders()
  return orders.filter(order => order.userId === userId)
}

// Get orders by user email (for Google users who might not have consistent IDs)
export const getOrdersByUserEmail = (userEmail) => {
  const orders = readOrders()
  return orders.filter(order => order.userEmail === userEmail)
}

// Get all orders for a user (by ID or email)
export const getUserOrders = (userId, userEmail) => {
  const orders = readOrders()
  return orders.filter(order => 
    order.userId === userId || order.userEmail === userEmail
  )
}

// Get single order by ID
export const getOrderById = (orderId) => {
  const orders = readOrders()
  return orders.find(order => order.id === orderId)
}

// Update order status
export const updateOrderStatus = (orderId, newStatus) => {
  const orders = readOrders()
  const orderIndex = orders.findIndex(order => order.id === orderId)
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    orders[orderIndex].updatedAt = new Date().toISOString()
    writeOrders(orders)
    return orders[orderIndex]
  }
  
  return null
}

