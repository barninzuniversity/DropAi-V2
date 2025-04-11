import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCpu, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

// Components
import ProductCard from './ProductCard'

// Data
import { allProducts } from '../../data/products'

const ProductRecommendations = ({ currentProductId, userPreferences = {} }) => {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackGiven, setFeedbackGiven] = useState({})

  useEffect(() => {
    // Simulate AI recommendation algorithm
    const getRecommendations = () => {
      setIsLoading(true)
      
      // In a real app, this would be an API call to an AI service
      setTimeout(() => {
        // Filter out current product
        const filteredProducts = allProducts.filter(p => p.id !== currentProductId)
        
        // Simple recommendation logic (would be replaced by actual AI in production)
        // 1. Find products in the same category
        // 2. Sort by rating
        // 3. Take top 4
        const currentProduct = allProducts.find(p => p.id === currentProductId)
        
        let recommended = []
        
        if (currentProduct) {
          // Find products in the same category
          const sameCategory = filteredProducts.filter(
            p => p.category === currentProduct.category
          )
          
          // Sort by rating
          recommended = [...sameCategory].sort((a, b) => b.rating - a.rating).slice(0, 4)
        } else {
          // If no current product, just return top rated products
          recommended = [...filteredProducts].sort((a, b) => b.rating - a.rating).slice(0, 4)
        }
        
        setRecommendations(recommended)
        setIsLoading(false)
      }, 1000)
    }
    
    getRecommendations()
  }, [currentProductId, userPreferences])

  const handleFeedback = (productId, isPositive) => {
    // In a real app, this would send feedback to the AI system to improve recommendations
    console.log(`User ${isPositive ? 'liked' : 'disliked'} recommendation for product ${productId}`)
    
    // Update feedback state
    setFeedbackGiven(prev => ({
      ...prev,
      [productId]: isPositive
    }))
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">AI is generating recommendations...</span>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-3">
          <FiCpu className="text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold">AI-Powered Recommendations</h3>
          <p className="text-gray-600 text-sm">Products selected just for you by our smart algorithm</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            <ProductCard product={product} />
            
            {/* Feedback buttons */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {feedbackGiven[product.id] === undefined ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFeedback(product.id, true)}
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-green-500"
                    aria-label="Like recommendation"
                  >
                    <FiThumbsUp size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFeedback(product.id, false)}
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500"
                    aria-label="Dislike recommendation"
                  >
                    <FiThumbsDown size={14} />
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${feedbackGiven[product.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {feedbackGiven[product.id] ? 'Liked' : 'Disliked'}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProductRecommendations