'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../cart/cart.css'


export default function Account(){

const { data: session, status } = useSession()
const router = useRouter()
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        setError('Erreur lors du chargement des commandes')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return `${price.toFixed(2).replace('.', ',')}€`
  }

  if (loading) {
    return (
      <div>
        <div></div>
      </div>
    )
  }


    return(
        <>
        <div>
          {session? 
          <>
            <h3 className="cart-title mb-2">Welcome {session.user?.name}!</h3>
        {/* <div className="page-cart"></div> */}

            {orders.length === 0 &&
            <p className="m-0 p-0 empty-car">You haven't ordered anything yet.</p>}

          <div>
          {orders.map((order) => (
            <div key={order.id} >
              <div>
                <div>
                  <h2 >Commande #{order.orderNumber}</h2>
                  <p >Passée le {formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p>{formatPrice(order.totalAmount)}</p>
                  <p>{order.totalQuantity} livre(s)</p>
                  <span>
                    {order.status}
                  </span>
                </div>
              </div>

              <div>
                <h3>Articles commandés :</h3>
                <div>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <div>
                        {/* {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                          />
                        )} */}
                        <div>
                          <p>{item.title}</p>
                          <p>par {item.author}</p>
                          <p>Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <p>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
</>

                :
                    <p>Connecte-toi.</p>
                }
            </div>
        </>
    )

}