import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

// Store
import useCartStore from '../store/cartStore'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  // No steps needed as we only have shipping information
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0 && !orderComplete) {
      navigate('/cart')
    }

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [items, navigate, orderComplete])

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Calculate subtotal, shipping, and total
  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitShipping = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Create order data
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      items: items,
      payment: {
        method: 'Cash on Delivery',
        total: total,
        status: 'Pending - Payment on Delivery'
      },
      orderDate: new Date().toISOString(),
      orderNumber: 'ORD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    }

    // Process order and handle email notification
    try {
      // Import the email service dynamically to avoid issues with SSR
      const { sendOrderNotification } = await import('../utils/emailService');
      
      // Send the order notification email
      const result = await sendOrderNotification(orderData);
      
      // Check if there was an email error but continue with order process
      if (result && result.success === false) {
        console.error('Email notification failed:', result.error);
        // We'll still complete the order even if email fails
      }
      
      // Simulate order processing
      setTimeout(() => {
        setIsProcessing(false)
        setOrderComplete(true)
        clearCart()
      }, 1500)
    } catch (error) {
      console.error('Order process error:', error);
      // Still complete the order even if there's an error with the email
      setTimeout(() => {
        setIsProcessing(false)
        setOrderComplete(true)
        clearCart()
      }, 1500)
    }
  }

  // Only Cash on Delivery payment is supported

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="pt-24 pb-16">
        <div className="container max-w-3xl mx-auto">
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-green-600 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
              You will receive a confirmation email shortly.
            </p>
            <p className="text-amber-600 mb-8 text-sm font-medium">
              If you don't receive an order confirmation email within 30 minutes, please contact us at <a href="mailto:barninzshop@gmail.com" className="underline hover:text-amber-700">barninzshop@gmail.com</a>
            </p>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Order Number:</span>
                <span className="font-medium">ORD-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Order Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
              <Link to="/" className="btn btn-outline">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="mb-8">
          <Link to="/cart" className="flex items-center text-primary-600 hover:underline">
            <FiArrowLeft className="mr-2" /> Back to Cart
          </Link>
        </div>

        <motion.h1 
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Checkout
        </motion.h1>

        {/* No checkout steps needed as we only have shipping information */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shipping Information Form */}
                <form onSubmit={handleSubmitShipping}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Shipping Information</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="col-span-2">
                        <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-gray-700 font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="input"
                        required
                      >
                        <option value="Tunisia">Tunisia</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 flex justify-end">
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="animate-spin mr-2 inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                          Processing...
                        </>
                      ) : (
                        'Complete Order (Cash on Delivery)'
                      )}
                    </motion.button>
                  </div>
                </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="max-h-60 overflow-y-auto mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage