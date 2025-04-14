import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheckCircle, FiPhone, FiMail, FiClock, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const PurchaseConfirmationPage = () => {
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true })
  
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={contentInView ? { opacity: 1, y: 0 } : {}}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.2 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-4xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-primary-100">Your purchase has been successfully placed.</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-700 text-lg mb-4">
                We're excited to fulfill your order. One of our representatives will contact you 
                within the next 12 hours to confirm your order details.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FiClock className="mr-2 text-primary-500" /> Important Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you don't receive a call from us within 12 hours, please email us directly at{' '}
                <a 
                  href="mailto:barninzshop@gmail.com" 
                  className="text-primary-600 font-medium hover:underline"
                >
                  barninzshop@gmail.com
                </a> with your order information.
              </p>
              <div className="flex items-center text-gray-600 text-sm">
                <FiShoppingBag className="mr-2" /> 
                Please include "Order Follow-up" in the subject line
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <FiPhone className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contact Phone</h3>
                  <p className="text-gray-600">+216 28 647 334</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <FiMail className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contact Email</h3>
                  <p className="text-gray-600">barninzshop@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                to="/"
                className="btn btn-primary inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PurchaseConfirmationPage
