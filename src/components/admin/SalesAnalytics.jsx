import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBarChart2, FiDollarSign, FiShoppingBag, FiUsers, FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

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

  // Generate mock sales data based on time range
  const generateMockData = (range) => {
    const today = new Date()
    let labels = []
    let revenue = []
    let orders = []
    
    // Generate date labels and random data based on selected time range
    switch (range) {
      case 'day':
        // Hourly data for today
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
        revenue = Array.from({ length: 24 }, () => Math.floor(Math.random() * 500) + 100)
        orders = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1)
        break
      case 'week':
        // Daily data for the week
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
          revenue.push(Math.floor(Math.random() * 2000) + 500)
          orders.push(Math.floor(Math.random() * 30) + 5)
        }
        break
      case 'month':
        // Weekly data for the month
        for (let i = 0; i < 4; i++) {
          labels.push(`Week ${i + 1}`)
          revenue.push(Math.floor(Math.random() * 10000) + 2000)
          orders.push(Math.floor(Math.random() * 100) + 20)
        }
        break
      case 'year':
        // Monthly data for the year
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        labels = monthNames
        revenue = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50000) + 10000)
        orders = Array.from({ length: 12 }, () => Math.floor(Math.random() * 500) + 100)
        break
      default:
        break
    }
    
    // Calculate totals and averages
    const totalRevenue = revenue.reduce((sum, val) => sum + val, 0)
    const totalOrders = orders.reduce((sum, val) => sum + val, 0)
    const averageOrderValue = totalRevenue / totalOrders
    
    // Calculate percent changes (mock data)
    const revenueChange = Math.floor(Math.random() * 30) - 10 // -10% to +20%
    const ordersChange = Math.floor(Math.random() * 25) - 5 // -5% to +20%
    
    // Top selling products (mock data)
    const topProducts = [
      { id: 1, name: 'Premium Wireless Earbuds', sales: Math.floor(Math.random() * 50) + 20, revenue: Math.floor(Math.random() * 5000) + 1000 },
      { id: 2, name: 'Smart Fitness Tracker Watch', sales: Math.floor(Math.random() * 40) + 15, revenue: Math.floor(Math.random() * 4000) + 800 },
      { id: 3, name: 'Portable Bluetooth Speaker', sales: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(Math.random() * 3000) + 600 },
      { id: 5, name: 'Smart Home Security Camera', sales: Math.floor(Math.random() * 25) + 5, revenue: Math.floor(Math.random() * 2500) + 400 },
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
              <div className={`flex items-center mt-2 ${salesData.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {salesData.revenueChange >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                <span className="text-sm font-medium">{Math.abs(salesData.revenueChange)}% from previous {timeRange}</span>
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
              <div className={`flex items-center mt-2 ${salesData.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {salesData.ordersChange >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                <span className="text-sm font-medium">{Math.abs(salesData.ordersChange)}% from previous {timeRange}</span>
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
          {/* Simple bar chart visualization */}
          {salesData.revenue.map((value, index) => {
            const height = `${(value / Math.max(...salesData.revenue)) * 100}%`
            return (
              <div key={index} className="flex flex-col items-center justify-end h-full">
                <div 
                  className="w-12 bg-primary-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-primary-600"
                  style={{ height }}
                  title={`${salesData.labels[index]}: ${formatCurrency(value)}`}
                ></div>
                <div className="text-xs text-gray-600 mt-2 w-12 text-center truncate">{salesData.labels[index]}</div>
              </div>
            )
          })}
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
                <tr key={product.id}>
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