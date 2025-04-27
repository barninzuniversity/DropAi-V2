import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

// Store
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'

const CartPage = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getItemCount 
  } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [removingItemId, setRemovingItemId] = useState(null)
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  // Calculate cart totals
  const subtotal = getCartTotal()
  const itemCount = getItemCount()
  const isEmpty = itemCount === 0
  const shipping = !isEmpty ? 7 : 0 // Flat 7 TND shipping fee if cart has items
  const orderTotal = subtotal + shipping

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId)
      return
    }
    
    const success = await updateQuantity(productId, newQuantity)
    if (!success) {
      toast.error('Failed to update quantity. Item may be out of stock.')
    }
  }

  const handleRemoveItem = async (productId) => {
    setRemovingItemId(productId)
    try {
      await removeItem(productId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
      console.error('Error removing item:', error)
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      setShowClearCartConfirm(false)
      toast.success('Cart cleared')
    } catch (error) {
      toast.error('Failed to clear cart')
      console.error('Error clearing cart:', error)
    }
  }

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to checkout')
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    
    // Store cart items in session storage for the confirmation page
    sessionStorage.setItem('orderItems', JSON.stringify(items))
    navigate('/checkout')
  }

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
            className="text-center py-16 bg-gray-50 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
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
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Cart Items ({itemCount})</h2>
                    <button 
                      onClick={() => setShowClearCartConfirm(true)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Item Header - Desktop */}
                <div className="hidden md:grid grid-cols-12 p-4 bg-gray-50 border-b text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                {/* Cart Items */}
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div 
                      key={item.id}
                      className="border-b border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ opacity: removingItemId === item.id ? 0.5 : 1 }}
                    >
                      <div className="grid grid-cols-12 p-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-12 md:col-span-6 flex items-center mb-4 md:mb-0">
                          {/* Product Image */}
                          <div className="w-20 h-20 mr-4 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Name & Remove Button */}
                          <div>
                            <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-sm text-red-500 hover:text-red-700"
                              disabled={removingItemId === item.id}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-4 md:col-span-2 text-center">
                          <span className="md:hidden text-gray-500 mr-2">Price:</span>
                          <span>{item.price.toFixed(2)} TND</span>
                        </div>
                        
                        {/* Quantity */}
                        <div className="col-span-4 md:col-span-2 flex justify-center">
                          <div className="flex border rounded-md">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="text-gray-600" />
                            </button>
                            <input 
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value > 0) {
                                  handleUpdateQuantity(item.id, value);
                                }
                              }}
                              className="w-12 text-center border-x border-gray-200 focus:outline-none"
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                            >
                              <FiPlus className="text-gray-600" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="col-span-4 md:col-span-2 text-center font-medium">
                          <span className="md:hidden text-gray-500 mr-2">Total:</span>
                          <span>{(item.price * item.quantity).toFixed(2)} TND</span>
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping.toFixed(2)} TND</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{orderTotal.toFixed(2)} TND</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToCheckout}
                  className="btn btn-primary w-full mt-6"
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Clear Cart Confirmation Modal */}
        <AnimatePresence>
          {showClearCartConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full"
              >
                <h3 className="text-xl font-bold mb-4">Clear Cart?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove all items from your cart?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowClearCartConfirm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="btn btn-danger"
                  >
                    Clear Cart
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CartPage
