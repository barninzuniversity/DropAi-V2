import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

// Store
import useCartStore from '../store/cartStore'
import useNotificationStore from '../store/notificationStore'

// Import the centralized price formatter utility
import { formatPrice } from '../utils/priceFormatter'

const CheckoutPage = ({ products, updateProductStock }) => {
  const navigate = useNavigate()
  const { 
    items, 
    getCartTotal, 
    getCartOriginalTotal,
    getCartSavings,
    clearCart 
  } = useCartStore()
  
  const { addNotification } = useNotificationStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Tunisia'
  })

  useEffect(() => {
    // Check if there's a completed order in session storage
    const completedOrder = sessionStorage.getItem('orderCompleted');
    
    // Redirect to cart if cart is empty and no completed order
    if (items.length === 0 && !orderComplete && !completedOrder) {
      navigate('/cart')
    }

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [items, navigate, orderComplete])

  // Validate stock availability before checkout
  const validateStockAvailability = () => {
    if (!products) return { success: true, insufficientItems: [] };
    
    const insufficientItems = [];
    
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      
      if (!product) {
        insufficientItems.push({ 
          id: item.id, 
          name: item.name,
          message: 'Product not found in inventory' 
        });
        continue;
      }
      
      if (product.stock < item.quantity) {
        insufficientItems.push({ 
          id: item.id, 
          name: item.name,
          requested: item.quantity, 
          available: product.stock,
          message: `Only ${product.stock} units available`
        });
      }
    }
    
    return {
      success: insufficientItems.length === 0,
      insufficientItems
    };
  };

  // Calculate prices
  const subtotal = getCartTotal();
  const originalSubtotal = getCartOriginalTotal();
  const totalSavings = getCartSavings();
  const shipping = 7; // Flat 7 TND shipping fee
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Update inventory for order items
  const updateInventoryForOrder = (orderItems) => {
    if (!products || !updateProductStock) return;
    
    orderItems.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        // Calculate new stock by subtracting quantity ordered
        const newStock = Math.max(0, product.stock - item.quantity);
        
        // Update the product stock
        updateProductStock(item.id, newStock);
        
        console.log(`Updated stock for ${item.name}: ${product.stock} -> ${newStock}`);
        
        // Show notification for low stock items
        if (newStock < 5 && newStock > 0) {
          addNotification({
            type: 'info',
            message: `Low stock alert: Only ${newStock} units of "${item.name}" remaining.`
          });
        } else if (newStock === 0) {
          addNotification({
            type: 'warning',
            message: `"${item.name}" is now out of stock.`
          });
        }
      }
    });
  };

  const handleSubmitShipping = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Validate stock availability before processing
    const stockValidation = validateStockAvailability();
    
    if (!stockValidation.success) {
      setIsProcessing(false);
      
      // Display notification about insufficient stock
      addNotification({
        type: 'error',
        message: 'Some items in your cart are out of stock'
      });
      
      // Store insufficiency data for the cart page
      sessionStorage.setItem('insufficientItems', JSON.stringify(stockValidation.insufficientItems));
      
      // Navigate back to cart
      navigate('/cart');
      return;
    }

    // Create order data with full price information
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
      items: items.map(item => {
        // Ensure we have consistent price properties
        const finalPrice = item.finalPrice || item.price;
        const originalPrice = item.originalPrice || item.price;
        const discountPercentage = item.discountPercentage || 0;
        
        return {
          ...item,
          finalPrice,
          originalPrice,
          discountPercentage,
          itemTotal: finalPrice * item.quantity,
          savings: originalPrice !== finalPrice ? (originalPrice - finalPrice) * item.quantity : 0
        };
      }),
      payment: {
        method: 'Cash on Delivery',
        subtotal: subtotal,
        originalSubtotal: originalSubtotal,
        totalSavings: totalSavings,
        shipping: shipping,
        total: total,
        status: 'Pending - Payment on Delivery'
      },
      orderDate: new Date().toISOString(),
      orderNumber: 'ORD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    }

    // Process order
    try {
      // Store order items for confirmation page
      sessionStorage.setItem('orderItems', JSON.stringify(items));
      
      // Update inventory for ordered items
      updateInventoryForOrder(items);
      
      // Try to send email notification if available
      try {
        // Import the email service dynamically to avoid issues with SSR
        const { sendOrderNotification } = await import('../utils/emailService');
        
        // Send the order notification email
        const result = await sendOrderNotification(orderData);
        
        // Check if there was an email error but continue with order process
        if (result && result.success === false) {
          console.error('Email notification failed:', result.error);
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
        // Continue with order process even if email fails
      }
      
      // Simulate order processing
      setTimeout(() => {
        // Set order completed flag in session storage
        sessionStorage.setItem('orderCompleted', 'true');
        sessionStorage.setItem('orderNumber', orderData.orderNumber);
        sessionStorage.setItem('orderDate', new Date().toLocaleDateString());
        sessionStorage.setItem('orderTotal', total.toFixed(2));
        
        setIsProcessing(false)
        setOrderComplete(true)
        clearCart()
      }, 1500)
    } catch (error) {
      console.error('Order process error:', error);
      
      // Still complete the order even if there's an error
      sessionStorage.setItem('orderItems', JSON.stringify(items));
      updateInventoryForOrder(items);
      
      setTimeout(() => {
        sessionStorage.setItem('orderCompleted', 'true');
        sessionStorage.setItem('orderNumber', orderData.orderNumber);
        sessionStorage.setItem('orderDate', new Date().toLocaleDateString());
        sessionStorage.setItem('orderTotal', total.toFixed(2));
        
        setIsProcessing(false)
        setOrderComplete(true)
        clearCart()
      }, 1500)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  // Order complete state
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
              If you don't receive an order confirmation email within 6 hours, please contact us at <a href="mailto:barninzshop@gmail.com" className="underline hover:text-amber-700">barninzshop@gmail.com</a>
            </p>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Order Number:</span>
                <span className="font-medium">{sessionStorage.getItem('orderNumber') || 'ORD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Order Date:</span>
                <span className="font-medium">{sessionStorage.getItem('orderDate') || new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold">{sessionStorage.getItem('orderTotal') ? `${sessionStorage.getItem('orderTotal')} TND` : formatPrice(total)}</span>
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

  // Regular checkout state
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
                  {items.map(item => {
                    // Get prices with fallbacks
                    const finalPrice = item.finalPrice || item.price;
                    const originalPrice = item.originalPrice || item.price;
                    const hasDiscount = originalPrice > finalPrice;
                    const discountPercentage = hasDiscount ? 
                      Math.round((1 - (finalPrice / originalPrice)) * 100) : 0;
                    
                    // Check stock availability for this item
                    const product = products ? products.find(p => p.id === item.id) : null;
                    const isLowStock = product && product.stock < 10 && product.stock > 0;
                    const isOutOfStock = product && product.stock === 0;
                    const hasInsufficientStock = product && product.stock < item.quantity;
                    
                    return (
                      <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <div className="flex justify-between text-sm">
                            <span>Qty: {item.quantity}</span>
                            {/* Always show the current/discounted price */}
                            <span className="font-medium">{formatPrice(finalPrice * item.quantity)}</span>
                          </div>
                          
                          {/* Only show the original price if there's a discount */}
                          {hasDiscount && (
                            <div className="text-xs text-right">
                              <span className="line-through text-gray-500">
                                {formatPrice(originalPrice * item.quantity)}
                              </span>
                              <span className="ml-1 text-red-500">
                                ({discountPercentage}% off)
                              </span>
                            </div>
                          )}
                          
                          {/* Show stock warnings */}
                          {isOutOfStock && (
                            <div className="text-xs text-red-600 mt-1">
                              Out of stock
                            </div>
                          )}
                          
                          {!isOutOfStock && hasInsufficientStock && (
                            <div className="text-xs text-red-600 mt-1">
                              Only {product.stock} available
                            </div>
                          )}
                          
                          {!hasInsufficientStock && isLowStock && (
                            <div className="text-xs text-amber-600 mt-1">
                              Low stock: {product.stock} left
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Order totals */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {formatPrice(shipping)}
                  </span>
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
