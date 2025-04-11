import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiAlertTriangle, FiPlus, FiMinus, FiSave, FiRefreshCw } from 'react-icons/fi'

const StorageManager = ({ products, onUpdateStock }) => {
  const [stockUpdates, setStockUpdates] = useState({})
  const [filter, setFilter] = useState('all') // 'all', 'low', 'out'
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Initialize stock updates
  useEffect(() => {
    const initialUpdates = {}
    products.forEach(product => {
      initialUpdates[product.id] = 0
    })
    setStockUpdates(initialUpdates)
  }, [products])
  
  // Filter products based on stock status and search term
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'low') {
      return product.stock < 10 && matchesSearch
    } else if (filter === 'out') {
      return product.stock === 0 && matchesSearch
    }
    
    return matchesSearch
  })
  
  // Handle stock adjustment
  const handleStockChange = (productId, amount) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + amount
    }))
  }
  
  // Reset a specific product's stock update
  const resetStockUpdate = (productId) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: 0
    }))
  }
  
  // Apply all stock updates
  const applyStockUpdates = () => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      Object.entries(stockUpdates).forEach(([productId, change]) => {
        if (change !== 0) {
          const product = products.find(p => p.id === parseInt(productId))
          if (product) {
            const newStock = Math.max(0, product.stock + change)
            onUpdateStock(parseInt(productId), newStock)
          }
        }
      })
      
      // Reset all stock updates
      const resetUpdates = {}
      products.forEach(product => {
        resetUpdates[product.id] = 0
      })
      setStockUpdates(resetUpdates)
      setIsLoading(false)
    }, 800)
  }
  
  // Calculate stock status for progress bar
  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-500', label: 'Out of Stock' }
    if (stock < 5) return { color: 'bg-red-400', label: 'Critical' }
    if (stock < 10) return { color: 'bg-amber-500', label: 'Low' }
    if (stock < 20) return { color: 'bg-amber-400', label: 'Medium' }
    return { color: 'bg-green-500', label: 'Good' }
  }
  
  // Calculate progress percentage (max at 100 units)
  const getStockPercentage = (stock) => {
    return Math.min(100, (stock / 100) * 100)
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Storage Management</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'low' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'out' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Out of Stock
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      {/* Stock Updates Summary */}
      {Object.values(stockUpdates).some(value => value !== 0) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-800">Pending Stock Updates</h3>
              <p className="text-sm text-blue-600">
                {Object.values(stockUpdates).filter(value => value !== 0).length} products have pending changes
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const resetUpdates = {}
                  products.forEach(product => {
                    resetUpdates[product.id] = 0
                  })
                  setStockUpdates(resetUpdates)
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm flex items-center gap-1"
              >
                <FiRefreshCw size={14} /> Reset All
              </button>
              <button
                onClick={applyStockUpdates}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={14} /> Apply Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. {searchTerm ? 'Try adjusting your search.' : ''}
          </div>
        ) : (
          filteredProducts.map(product => {
            const stockStatus = getStockStatus(product.stock)
            const stockPercentage = getStockPercentage(product.stock)
            const pendingUpdate = stockUpdates[product.id] || 0
            const projectedStock = Math.max(0, product.stock + pendingUpdate)
            const projectedStatus = getStockStatus(projectedStock)
            
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex items-center flex-grow">
                    <div className="h-16 w-16 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-contain p-2"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                      <div className="text-sm">
                        <span className="font-medium">Category:</span> {product.category}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Stock: {product.stock}</span>
                      <span className={`font-medium ${product.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${stockStatus.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                    
                    {pendingUpdate !== 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Projected Stock: {projectedStock}</span>
                          <span className={`font-medium ${projectedStock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                            {projectedStatus.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`${projectedStatus.color} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${getStockPercentage(projectedStock)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {pendingUpdate > 0 ? `+${pendingUpdate}` : pendingUpdate} units pending
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Stock Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStockChange(product.id, -1)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                      disabled={product.stock + (stockUpdates[product.id] || 0) <= 0}
                    >
                      <FiMinus size={16} />
                    </button>
                    <div className="w-12 text-center font-medium">
                      {pendingUpdate > 0 && '+'}{pendingUpdate !== 0 ? pendingUpdate : '-'}
                    </div>
                    <button
                      onClick={() => handleStockChange(product.id, 1)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      <FiPlus size={16} />
                    </button>
                    {pendingUpdate !== 0 && (
                      <button
                        onClick={() => resetStockUpdate(product.id)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        <FiRefreshCw size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default StorageManager
 