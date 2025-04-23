import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi'
import useCartStore from '../../store/cartStore'

const CheckoutConfirmation = ({ onClose }) => {
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const { checkout, getSubtotal, items } = useCartStore()
  
  const handleCheckout = async () => {
    setProcessing(true)
    
    // Simulate API call to payment processor
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Process checkout (deduct from inventory)
      const checkoutResult = checkout()
      
      setResult(checkoutResult)
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred while processing your payment. Please try again.'
      })
    } finally {
      setProcessing(false)
    }
  }
  
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Your Order</h2>
      
      {!result ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="divide-y divide-gray-200">
                {items.map(item => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{getSubtotal().toFixed(2)} TND</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={processing}
            >
              Cancel
            </motion.button>
            
            <motion.button
              onClick={handleCheckout}
              className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={processing}
            >
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Order"
              )}
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg text-center ${
            result.success ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="flex justify-center mb-4">
            {result.success ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="text-green-500 text-3xl" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="text-red-500 text-3xl" />
              </div>
            )}
          </div>
          
          <h3 className={`text-xl font-bold mb-2 ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.success ? 'Order Confirmed!' : 'Order Failed'}
          </h3>
          
          <p className="text-gray-600 mb-6">{result.message}</p>
          
          <motion.button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {result.success ? 'Continue Shopping' : 'Try Again'}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default CheckoutConfirmation