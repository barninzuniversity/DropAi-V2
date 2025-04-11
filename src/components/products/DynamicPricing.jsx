import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown, FiClock, FiInfo } from 'react-icons/fi'

const DynamicPricing = ({ basePrice, productId, discount = 0 }) => {
  const [currentPrice, setCurrentPrice] = useState(basePrice)
  const [priceHistory, setPriceHistory] = useState([])
  const [showTooltip, setShowTooltip] = useState(false)
  const [priceDirection, setPriceDirection] = useState(null) // 'up', 'down', or null
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI dynamic pricing algorithm
    const generatePriceHistory = () => {
      setIsLoading(true)
      
      // In a real app, this would be an API call to an AI pricing service
      setTimeout(() => {
        // Generate simulated price history for the last 7 days
        const today = new Date()
        const history = []
        
        // Base fluctuation range (±10% of base price)
        const fluctuationRange = basePrice * 0.1
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          
          // Generate a random price within the fluctuation range
          const randomFactor = Math.random() * 2 - 1 // Between -1 and 1
          const priceVariation = basePrice + (randomFactor * fluctuationRange)
          
          // Ensure price doesn't go below a certain threshold (e.g., 80% of base price)
          const minPrice = basePrice * 0.8
          const adjustedPrice = Math.max(priceVariation, minPrice)
          
          history.push({
            date: date.toISOString().split('T')[0],
            price: parseFloat(adjustedPrice.toFixed(2))
          })
        }
        
        // Set the current price to the last price in the history
        const latestPrice = history[history.length - 1].price
        
        // Apply discount if any
        const discountedPrice = discount > 0 
          ? latestPrice - (latestPrice * (discount / 100))
          : latestPrice
        
        setCurrentPrice(parseFloat(discountedPrice.toFixed(2)))
        setPriceHistory(history)
        
        // Determine price direction
        if (history.length >= 2) {
          const previousPrice = history[history.length - 2].price
          const currentHistoryPrice = history[history.length - 1].price
          
          if (currentHistoryPrice > previousPrice) {
            setPriceDirection('up')
          } else if (currentHistoryPrice < previousPrice) {
            setPriceDirection('down')
          } else {
            setPriceDirection(null)
          }
        }
        
        setIsLoading(false)
      }, 1000)
    }
    
    generatePriceHistory()
  }, [basePrice, productId, discount])

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600"></div>
        <span className="text-sm text-gray-500">Calculating optimal price...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="relative">
          <motion.span 
            className="text-2xl font-bold text-primary-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatPrice(currentPrice)}
          </motion.span>
          
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through ml-2">
              {formatPrice(basePrice)}
            </span>
          )}
          
          <div className="relative inline-block ml-2">
            <button 
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Price information"
            >
              <FiInfo size={16} />
            </button>
            
            {showTooltip && (
              <motion.div 
                className="absolute z-10 w-64 p-4 mt-2 -left-28 bg-white rounded-lg shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-bold text-sm mb-2">AI Dynamic Pricing</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Our AI adjusts prices based on market demand, inventory levels, and shopping trends to offer you the best value.
                </p>
                
                {priceHistory.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Price history (7 days):</div>
                    <div className="h-20 flex items-end space-x-1">
                      {priceHistory.map((item, index) => {
                        // Calculate height percentage based on min/max prices
                        const prices = priceHistory.map(p => p.price)
                        const minPrice = Math.min(...prices)
                        const maxPrice = Math.max(...prices)
                        const range = maxPrice - minPrice
                        const heightPercentage = range === 0 
                          ? 50 
                          : ((item.price - minPrice) / range) * 80 + 20
                        
                        return (
                          <div key={item.date} className="flex flex-col items-center">
                            <div 
                              className={`w-6 ${index === priceHistory.length - 1 ? 'bg-primary-500' : 'bg-gray-300'} rounded-t`}
                              style={{ height: `${heightPercentage}%` }}
                            ></div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              {new Date(item.date).getDate()}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {priceDirection && (
          <motion.div 
            className={`ml-2 flex items-center text-xs font-medium ${priceDirection === 'down' ? 'text-green-600' : 'text-amber-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {priceDirection === 'down' ? (
              <>
                <FiTrendingDown className="mr-1" />
                <span>Price dropped</span>
              </>
            ) : (
              <>
                <FiTrendingUp className="mr-1" />
                <span>Price increased</span>
              </>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <FiClock className="mr-1" />
        <span>Price updated today</span>
      </div>
    </div>
  )
}

export default DynamicPricing