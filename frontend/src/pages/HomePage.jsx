import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const CATEGORIES = ['All', 'PICKLES', 'PODULU', 'SNACKS', 'SWEETS']

function HomePage() {
  const [dishes, setDishes] = useState([])
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(true)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Load menu from backend
  useEffect(() => {
    api.get('/menu')
      .then(res => setDishes(res.data))
      .catch(err => console.error('Menu load failed:', err))
      .finally(() => setLoading(false))
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === dish.id)
      if (existing) {
        return prev.map(i => i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...dish, quantity: 1 }]
    })
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  const filtered = category === 'All'
    ? dishes
    : dishes.filter(d => d.category === category)

  return (
    <div className="min-h-screen bg-orange-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white text-xl">
              🫙
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-800">Lakshmi Home Foods</h1>
              <p className="text-xs text-amber-700">homemade Telangana flavors</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Hi, {user.fullName?.split(' ')[0]}</span>
                {isAdmin() && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-sm text-red-800 font-semibold hover:underline"
                  >
                    Dashboard 👑
                  </button>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-600 hover:text-red-800"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-sm bg-red-800 text-white px-4 py-2 rounded-full hover:bg-red-900"
                >
                  Register
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-2xl"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-red-800 text-white text-center py-16 px-4">
        <h2 className="text-4xl font-bold mb-3">Amma's kitchen, shipped across India</h2>
        <p className="text-red-200 text-lg mb-6">
          Small-batch pickles, podulu, snacks &amp; sweets — made fresh, couriered to your door
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-red-800 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition"
        >
          Shop the new batch
        </button>
      </section>

      {/* CATEGORY CHIPS */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-3 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? 'bg-red-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-800 hover:text-red-800'
            }`}
          >
            {cat === 'PICKLES' ? '🥫 Pickles' :
             cat === 'PODULU' ? '🌾 Podulu' :
             cat === 'SNACKS' ? '🍘 Snacks' :
             cat === 'SWEETS' ? '🍬 Sweets' : '🛍️ All'}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">Loading Amma's kitchen...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            No items in this category yet — check back soon! 🫙
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(dish => (
              <div key={dish.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
                {/* Card image area */}
                <div className="bg-orange-50 h-40 flex items-center justify-center text-6xl">
                  {dish.category === 'PICKLES' ? '🥫' :
                   dish.category === 'PODULU' ? '🌾' :
                   dish.category === 'SNACKS' ? '🍘' :
                   dish.category === 'SWEETS' ? '🍬' : '🫙'}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg">{dish.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-red-800">₹{dish.price}</span>
                    <button
                      onClick={() => addToCart(dish)}
                      className="bg-red-800 text-white text-sm px-4 py-2 rounded-full hover:bg-red-900 transition"
                    >
                      Add to cart
                    </button>
                  </div>
                  {dish.available === false && (
                    <p className="text-xs text-red-500 mt-2 font-medium">Currently unavailable</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-red-900 text-red-200 text-center py-8 text-sm">
        <p className="font-bold text-white text-lg mb-1">Lakshmi Home Foods 🫙</p>
        <p>Made with love in Amma's kitchen · Ships pan-India</p>
        <p className="mt-1">orders@lakshmihomefoods.com</p>
      </footer>

    </div>
  )
}

export default HomePage