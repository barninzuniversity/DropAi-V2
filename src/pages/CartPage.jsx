import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

// Context
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import useNotificationStore from '../store/notificationStore'
import { formatPrice } from '../utils/priceFormatter'

const CartPage = ({ products, updateProductStock }) => {
  const { items, removeItem, updateQuantity, clearCart, total, isEmpty } = useCart()
  const { isAuthenticated } = useAuth()
  const { addNotification } = useNotificationStore()
  const [isLoading, setIsLoading] = useState(true)
  const [removingItemId, setRemovingItemId] = useState(null)
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const orderConfirmed = queryParams.get('orderConfirmed') === 'true'
  const [isCompletingOrder, setIsCompletingOrder] = useState(false)

  useEffect(() => {
    // Check for order completion in session storage
    const orderJustCompleted = sessionStorage.getItem('orderCompleted') === 'true'
    
    // Handle both URL parameter and session storage
    if (orderConfirmed || orderJustCompleted) {
      setIsCompletingOrder(true)
      
      // If URL has the parameter but session doesn't have the flag, set it
      if (orderConfirmed && !orderJustCompleted) {
        sessionStorage.setItem('orderCompleted', 'true')
      }
      
      // Navigate to the confirmation page
      const redirectTimer = setTimeout(() => {
        navigate('/purchase-confirmation', { replace: true })
        
        // Clean up after redirect
        setTimeout(() => {
          sessionStorage.removeItem('orderCompleted')
        }, 1000)
      }, 100)
      
      return () => clearTimeout(redirectTimer)
    }

    // Normal loading process if not completing order
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [orderConfirmed, navigate])


  const handleQuantityChange = (item, change) => {
    const newQuantity = Math.max(1, item.quantity + change)
    
    // Check if we have product stock information
    if (products) {
      const currentProduct = products.find(p => p.id === item.id)
      
      // If increasing quantity, check stock availability
      if (change > 0 && currentProduct) {
        if (newQuantity > currentProduct.stock) {
          addNotification({
            type: 'error',
            message: `Sorry, only ${currentProduct.stock} units available for this product.`
          })
          return
        }
      }
    }
    
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
  
  // Handle proceeding to checkout
  const handleProceedToCheckout = (e) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      e.preventDefault()
      addNotification({
        type: 'error',
        message: 'Please log in to checkout'
      })
      navigate('/login')
      return
    }
    
    // Check stock availability
    if (products && items.some(item => {
      const product = products.find(p => p.id === item.id)
      return !product || product.stock < item.quantity
    })) {
      e.preventDefault()
      addNotification({
        type: 'error',
        message: 'Some items in your cart are out of stock or have insufficient quantity.'
      })
      return
    }
    
    // Store cart items in session storage for the confirmation page
    sessionStorage.setItem('orderItems', JSON.stringify(items))
    
    // Continue to checkout
    navigate('/checkout')
  }

  // Calculate shipping and total
  const subtotal = total // Total from cart context
  const shipping = !isEmpty ? 7 : 0 // Flat 7 TND shipping fee if cart has items
  const orderTotal = subtotal + shipping

  if (isLoading || isCompletingOrder) {
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
        <div className="mb-8 flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold text-center lg:text-left"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Shopping Cart
          </motion.h1>
          
          <Link to="/products" className="flex items-center text-primary-600 hover:underline">
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>

        {isEmpty ? (
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
                      onClick={() => setShowClearCartConfirm(true)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                    
                    {/* Clear Cart Confirmation */}
                    {showClearCartConfirm && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                          <h3 className="text-xl font-bold mb-4">Clear Your Cart?</h3>
                          <p className="text-gray-600 mb-6">
                            Are you sure you want to remove all items from your cart? This action cannot be undone.
                          </p>
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => setShowClearCartConfirm(false)}
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                clearCart();
                                setShowClearCartConfirm(false);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Clear Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {items.map(item => {                    
                    return (
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
                          
                          <div className="mt-1 text-sm text-gray-500">
                            <span className="block sm:inline">
                              Price: {formatPrice(item.price)}
                            </span>
                          </div>
                          
                          {/* Stock information */}
                          {products && (
                            <>
                              {(() => {
                                const currentProduct = products.find(p => p.id === item.id)
                                if (currentProduct) {
                                  const isLowStock = currentProduct.stock < 10
                                  const isOutOfStock = currentProduct.stock === 0
                                  
                                  if (isOutOfStock) {
                                    return (
                                      <div className="mt-1 text-red-600 text-sm font-medium">
                                        Out of stock
                                      </div>
                                    )
                                  } else if (isLowStock) {
                                    return (
                                      <div className="mt-1 text-amber-600 text-sm">
                                        Only {currentProduct.stock} left in stock
                                      </div>
                                    )
                                  }
                                }
                                return null
                              })()}
                            </>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
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
                                disabled={products && (() => {
                                  const currentProduct = products.find(p => p.id === item.id)
                                  return currentProduct && item.quantity >= currentProduct.stock
                                })()}
                              >
                                <FiPlus className={`${
                                  products && (() => {
                                    const currentProduct = products.find(p => p.id === item.id)
                                    return currentProduct && item.quantity >= currentProduct.stock
                                  })() ? 'text-gray-300' : 'text-gray-500'
                                }`} />
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
                    );
                  })}
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
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button 
                    onClick={handleProceedToCheckout}
                    className={`btn btn-primary w-full flex items-center justify-center gap-2 ${
                      products && items.some(item => {
                        const product = products.find(p => p.id === item.id)
                        return product && product.stock < item.quantity
                      }) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Proceed to Checkout <FiArrowRight />
                  </button>
                </motion.div>
                
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}


export default CartPage
