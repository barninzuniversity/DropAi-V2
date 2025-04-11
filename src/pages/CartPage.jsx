import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi'

// Store
import useCartStore from '../store/cartStore'

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, getCartTotal } = useCartStore()
  const [isLoading, setIsLoading] = useState(true)
  const [removingItemId, setRemovingItemId] = useState(null)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  const handleQuantityChange = (item, change) => {
    const newQuantity = Math.max(1, item.quantity + change)
    updateQuantity(item.id, newQuantity)
  }

  const handleRemoveItem = (itemId) => {
    setRemovingItemId(itemId)
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      removeItem(itemId)
      setRemovingItemId(null)
    }, 300)
  }

  // Calculate subtotal, shipping, and total
  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-center lg:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Shopping Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div 
            className="text-center py-16 bg-gray-50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiShoppingCart className="text-5xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Cart Items ({items.length})</h2>
                    <button 
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {items.map(item => (
                    <motion.div 
                      key={item.id}
                      className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ opacity: removingItemId === item.id ? 0.5 : 1 }}
                    >
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button 
                              onClick={() => handleQuantityChange(item, -1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="text-gray-500" />
                            </button>
                            <span className="mx-2 w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item, 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FiPlus className="text-gray-500" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-sm text-gray-500">
                      Add {formatPrice(100 - subtotal)} more to qualify for free shipping
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/checkout" 
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <FiArrowRight />
                  </Link>
                </motion.div>
                
                <div className="mt-6">
                  <Link 
                    to="/products" 
                    className="text-primary-600 hover:underline text-sm flex justify-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage