import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBarChart2, FiDollarSign, FiShoppingBag } from 'react-icons/fi'

const SalesAnalytics = () => {
  // In a real app, this would come from an API
  const [salesData, setSalesData] = useState(null)
  const [timeRange, setTimeRange] = useState('week') // 'day', 'week', 'month', 'year'
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch sales data
    setIsLoading(true)
    setTimeout(() => {
      // Mock data for demonstration
      const mockData = generateMockData(timeRange)
      setSalesData(mockData)
      setIsLoading(false)
    }, 800)
  }, [timeRange])

  // Generate mock sales data based on time range with all revenue values set to 0
  const generateMockData = (range) => {
    const today = new Date()
    let labels = []
    let revenue = []
    let orders = []
    
    // Generate date labels and zero data based on selected time range
    switch (range) {
      case 'day':
        // Hourly data for today
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
        revenue = Array.from({ length: 24 }, () => 0)
        orders = Array.from({ length: 24 }, () => 0)
        break
      case 'week':
        // Daily data for the week
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
          revenue.push(0)
          orders.push(0)
        }
        break
      case 'month':
        // Weekly data for the month
        for (let i = 0; i < 4; i++) {
          labels.push(`Week ${i + 1}`)
          revenue.push(0)
          orders.push(0)
        }
        break
      case 'year':
        // Monthly data for the year
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        labels = monthNames
        revenue = Array.from({ length: 12 }, () => 0)
        orders = Array.from({ length: 12 }, () => 0)
        break
      default:
        // Default to week if none specified
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
          revenue.push(0)
          orders.push(0)
        }
        break
    }
    
    // All totals are set to 0
    const totalRevenue = 0
    const totalOrders = 0
    const averageOrderValue = 0
    
    // All percentage changes set to 0
    const revenueChange = 0
    const ordersChange = 0
    
    // Top selling products with 0 values
    const topProducts = [
      { id: 1, name: 'Premium Wireless Earbuds', sales: 0, revenue: 0 },
      { id: 2, name: 'Smart Fitness Tracker Watch', sales: 0, revenue: 0 },
      { id: 3, name: 'Portable Bluetooth Speaker', sales: 0, revenue: 0 },
      { id: 4, name: 'Smart Home Security Camera', sales: 0, revenue: 0 },
    ]
    
    return {
      labels,
      revenue,
      orders,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueChange,
      ordersChange,
      topProducts
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        
        {/* Time Range Selector */}
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setTimeRange('day')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === 'day' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium ${timeRange === 'week' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-r border-gray-300`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium ${timeRange === 'month' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-r border-gray-300`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === 'year' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-r border-gray-300`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-800 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.totalRevenue)}</h3>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="text-sm font-medium">0% change</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500 bg-opacity-20 rounded-full">
              <FiDollarSign className="text-blue-700 text-xl" />
            </div>
          </div>
        </motion.div>
        
        {/* Orders Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-800 text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{salesData.totalOrders}</h3>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="text-sm font-medium">0% change</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500 bg-opacity-20 rounded-full">
              <FiShoppingBag className="text-purple-700 text-xl" />
            </div>
          </div>
        </motion.div>
        
        {/* Average Order Value Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-800 text-sm font-medium mb-1">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.averageOrderValue)}</h3>
              <div className="text-gray-600 mt-2">
                <span className="text-sm">Per order average</span>
              </div>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
              <FiBarChart2 className="text-green-700 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Sales Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-end justify-between">
          {/* Simple bar chart visualization with minimal but visible bars */}
          {salesData.revenue.map((value, index) => (
            <div key={`revenue-bar-${index}`} className="flex flex-col items-center justify-end h-full">
              <div 
                className="w-12 bg-primary-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-primary-600"
                style={{ height: "5px" }} // Slightly increased for better visibility
                title={`${salesData.labels[index]}: ${formatCurrency(0)}`}
              ></div>
              <div className="text-xs text-gray-600 mt-2 w-12 text-center truncate">
                {salesData.labels[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Selling Products */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.topProducts.map(product => (
                <tr key={`product-${product.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SalesAnalytics
