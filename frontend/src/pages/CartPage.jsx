import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function CartPage() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      ).filter(item => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (id) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const placeOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/orders', {
        userId: user.id,
        customerEmail: user.email,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      })
      localStorage.removeItem('cart')
      setOrderPlaced(true)
    } catch (err) {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Order placed!</h2>
          <p className="text-gray-500 mb-2">
            Thank you {user?.fullName?.split(' ')[0]}! Your order is confirmed.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            A confirmation email is on its way to {user?.email} 📧
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-red-800 text-white py-3 rounded-xl font-semibold hover:bg-red-900 transition"
          >
            Continue shopping 🫙
          </button>
        </div>
      </div>
    )
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some of Amma's specialties!</p>
          <Link
            to="/"
            className="inline-block bg-red-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-900 transition"
          >
            Browse products 🫙
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white text-xl">
              🫙
            </div>
            <h1 className="text-xl font-bold text-red-800">Lakshmi Home Foods</h1>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-red-800">
            ← Continue shopping
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your cart</h2>

        {/* Cart items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {cart.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-5 ${
                index < cart.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* Emoji */}
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {item.category === 'PICKLES' ? '🥫' :
                 item.category === 'PODULU' ? '🌾' :
                 item.category === 'SNACKS' ? '🍘' :
                 item.category === 'SWEETS' ? '🍬' : '🫙'}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-red-800 font-medium">₹{item.price}</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-800 hover:text-red-800 transition"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-800 hover:text-red-800 transition"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <div className="text-right min-w-16">
                <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-gray-400 hover:text-red-600 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Order summary</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Shipping</span>
            <span className="text-green-600">Calculated at checkout</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-red-800">₹{total.toFixed(2)}</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mt-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-red-800 text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-red-900 transition disabled:opacity-50"
          >
            {loading ? 'Placing order...' : `Place order · ₹${total.toFixed(2)}`}
          </button>

          {!user && (
            <p className="text-center text-sm text-gray-500 mt-3">
              You'll be asked to login before placing your order
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default CartPage