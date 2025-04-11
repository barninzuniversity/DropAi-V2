import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, FiEdit, FiCpu } from 'react-icons/fi'

// Components
import ProductRecommendations from '../components/products/ProductRecommendations'
import EditProfileModal from '../components/account/EditProfileModal'

// Store
import useAuthStore from '../store/authStore'

const AccountPage = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  
  // Refs for scroll animations
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Load user data
    const timer = setTimeout(() => {
      // If we have user data from auth store, use it as base
      const baseUserData = user || {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        joinDate: 'August 2023',
      }
      
      // Merge with mock data for demo purposes
      setUserData({
        ...baseUserData,
        orders: [
          {
            id: 'ORD-1234',
            date: '2023-10-15',
            total: 129.99,
            status: 'Delivered',
            items: [
              { id: 1, name: 'Premium Wireless Earbuds', price: 129.99, quantity: 1 }
            ]
          },
          {
            id: 'ORD-1235',
            date: '2023-09-28',
            total: 89.99,
            status: 'Delivered',
            items: [
              { id: 2, name: 'Smart Fitness Tracker Watch', price: 89.99, quantity: 1 }
            ]
          }
        ],
        wishlist: [
          { id: 3, name: 'Portable Bluetooth Speaker', price: 59.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' },
          { id: 4, name: 'Ultra-Slim Laptop Stand', price: 49.99, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' }
        ],
        preferences: {
          categories: ['Electronics', 'Fitness'],
          priceRange: [0, 200],
          brands: ['SoundCore', 'FitTech']
        }
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, navigate, user])

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'orders', label: 'Orders', icon: <FiPackage /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
    { id: 'preferences', label: 'AI Preferences', icon: <FiCpu /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ]

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalOpen(false)
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div 
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={userData.avatar} 
                alt={userData.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
              <p className="text-gray-600">Member since {userData.joinDate}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <nav>
                <ul>
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-6 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            ref={contentRef}
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline flex items-center gap-2"
                      onClick={() => setIsEditProfileModalOpen(true)}
                    >
                      <FiEdit size={16} /> Edit Profile
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-gray-500 text-sm mb-1">Full Name</h3>
                      <p className="font-medium">{userData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm mb-1">Email Address</h3>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm mb-1">Member Since</h3>
                      <p className="font-medium">{userData.joinDate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-12">
                    <h2 className="text-xl font-bold mb-6">Personalized For You</h2>
                    <ProductRecommendations userPreferences={userData.preferences} />
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>
                  
                  {userData.orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                      <Link to="/products" className="btn btn-primary">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userData.orders.map((order) => (
                        <motion.div 
                          key={order.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                              <div>
                                <span className="text-gray-500 text-sm">Order ID:</span>
                                <span className="font-medium ml-2">{order.id}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-sm">Date:</span>
                                <span className="font-medium ml-2">{formatDate(order.date)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-sm">Total:</span>
                                <span className="font-medium ml-2">{formatPrice(order.total)}</span>
                              </div>
                              <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <h3 className="font-bold mb-4">Items</h3>
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                            <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                              View Details →
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  
                  {userData.wishlist.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <FiHeart className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">Save items you're interested in for later.</p>
                      <Link to="/products" className="btn btn-primary">
                        Explore Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userData.wishlist.map((item) => (
                        <motion.div 
                          key={item.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="aspect-w-16 aspect-h-9">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2">{item.name}</h3>
                            <p className="text-primary-600 font-medium mb-4">{formatPrice(item.price)}</p>
                            <div className="flex space-x-2">
                              <button className="btn btn-primary py-2 flex-1">Add to Cart</button>
                              <button className="btn btn-outline py-2 px-3">
                                <FiHeart className="text-red-500 fill-current" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">AI Preferences</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <FiEdit size={16} /> Update Preferences
                    </motion.button>
                  </div>
                  
                  <p className="text-gray-600 mb-8">
                    Customize how our AI understands your preferences to provide better product recommendations.
                  </p>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Favorite Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.preferences.categories.map((category) => (
                          <span key={category} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full">
                            {category}
                          </span>
                        ))}
                        <button className="px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-full hover:bg-gray-50">
                          + Add Category
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Price Range</h3>
                      <div className="px-4">
                        <div className="h-2 bg-gray-200 rounded-full mb-6 relative">
                          <div 
                            className="absolute h-full bg-primary-500 rounded-full" 
                            style={{ 
                              left: `${(userData.preferences.priceRange[0] / 1000) * 100}%`, 
                              right: `${100 - (userData.preferences.priceRange[1] / 1000) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="absolute w-4 h-4 bg-white border-2 border-primary-500 rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                            style={{ left: `${(userData.preferences.priceRange[0] / 1000) * 100}%` }}
                          ></div>
                          <div 
                            className="absolute w-4 h-4 bg-white border-2 border-primary-500 rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                            style={{ left: `${(userData.preferences.priceRange[1] / 1000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatPrice(userData.preferences.priceRange[0])}</span>
                          <span>{formatPrice(userData.preferences.priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Preferred Brands</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.preferences.brands.map((brand) => (
                          <span key={brand} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full">
                            {brand}
                          </span>
                        ))}
                        <button className="px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-full hover:bg-gray-50">
                          + Add Brand
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-gray-500 text-sm">Receive notifications about your order status</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Promotions & Deals</p>
                            <p className="text-gray-500 text-sm">Get notified about sales and special offers</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">AI Recommendations</p>
                            <p className="text-gray-500 text-sm">Receive personalized product suggestions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Password</h3>
                      <button className="btn btn-outline">Change Password</button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Data & Privacy</h3>
                      <div className="space-y-4">
                        <button className="text-primary-600 hover:text-primary-700 font-medium">Download My Data</button>
                        <div className="border-t border-gray-200 pt-4">
                          <button className="text-red-600 hover:text-red-700 font-medium">Delete Account</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileModalOpen} 
        onClose={handleCloseEditProfileModal} 
      />
    </div>
  )
}

export default AccountPage