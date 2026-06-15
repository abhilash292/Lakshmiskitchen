import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function AdminPage() {
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const [newDish, setNewDish] = useState({
    name: '', description: '', price: '', category: 'PICKLES', available: true
  })
  const [addSuccess, setAddSuccess] = useState(false)
  const [addError, setAddError] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ordersRes, menuRes] = await Promise.all([
        api.get('/orders'),
        api.get('/menu'),
      ])
      setOrders(ordersRes.data)
      setMenuItems(menuRes.data)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDish = async (e) => {
    e.preventDefault()
    setAddError('')
    setAddSuccess(false)
    try {
      await api.post('/menu', {
        ...newDish,
        price: parseFloat(newDish.price),
      })
      setAddSuccess(true)
      setNewDish({ name: '', description: '', price: '', category: 'PICKLES', available: true })
      fetchData()
    } catch (err) {
      setAddError('Failed to add dish. Please try again.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const statusColor = (status) => {
    switch (status) {
      case 'PLACED': return 'bg-blue-50 text-blue-700'
      case 'PREPARING': return 'bg-yellow-50 text-yellow-700'
      case 'SHIPPED': return 'bg-purple-50 text-purple-700'
      case 'DELIVERED': return 'bg-green-50 text-green-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Header */}
      <header className="bg-red-800 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-xl">
              👑
            </div>
            <div>
              <h1 className="text-lg font-bold">Owner Dashboard</h1>
              <p className="text-red-200 text-xs">Lakshmi Home Foods · Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-red-200 text-sm hover:text-white">
              View store
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-700 px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Total orders</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{menuItems.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-yellow-700">To ship</p>
            <p className="text-3xl font-bold text-yellow-700 mt-1">
              {orders.filter(o => o.status === 'PLACED').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-green-700">Delivered</p>
            <p className="text-3xl font-bold text-green-700 mt-1">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-red-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-800'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              activeTab === 'menu'
                ? 'bg-red-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-800'
            }`}
          >
            Menu ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              activeTab === 'add'
                ? 'bg-red-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-800'
            }`}
          >
            + Add product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {orders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    No orders yet — share the store link! 🫙
                  </div>
                ) : (
                  orders.map((order, index) => (
                    <div
                      key={order.id}
                      className={`p-5 ${index < orders.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.customerEmail}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {order.items?.map((item, i) => (
                              <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                                {item.name} × {item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-red-800">₹{order.totalAmount}</p>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium mt-2 inline-block ${statusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* MENU TAB */}
            {activeTab === 'menu' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-5 ${
                      index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-800">₹{item.price}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD PRODUCT TAB */}
            {activeTab === 'add' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg">
                <h3 className="font-bold text-gray-800 mb-6 text-lg">Add new product</h3>

                {addSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
                    ✅ Product added successfully!
                  </div>
                )}
                {addError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
                    {addError}
                  </div>
                )}

                <form onSubmit={handleAddDish} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
                    <input
                      type="text"
                      value={newDish.name}
                      onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                      placeholder="Avakaya Pickle"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newDish.description}
                      onChange={e => setNewDish({ ...newDish, description: e.target.value })}
                      placeholder="Amma's signature raw mango pickle..."
                      rows={3}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={newDish.price}
                        onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                        placeholder="349"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newDish.category}
                        onChange={e => setNewDish({ ...newDish, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      >
                        <option value="PICKLES">🥫 Pickles</option>
                        <option value="PODULU">🌾 Podulu</option>
                        <option value="SNACKS">🍘 Snacks</option>
                        <option value="SWEETS">🍬 Sweets</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-800 text-white py-3 rounded-xl font-semibold hover:bg-red-900 transition"
                  >
                    Add product 🫙
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default AdminPage