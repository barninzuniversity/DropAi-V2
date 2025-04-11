import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiDollarSign, FiTag, FiGrid, FiLayers, FiShoppingBag, FiUsers, FiDatabase } from 'react-icons/fi'

// Admin Components
import SalesAnalytics from '../components/admin/SalesAnalytics'
import DiscountManager from '../components/admin/DiscountManager'
import InventoryManager from '../components/admin/InventoryManager'
import StorageManager from '../components/admin/StorageManager'
import AddProductForm from '../components/admin/AddProductForm'

// Data
import { allProducts } from '../data/products'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(allProducts)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  
  // Handle adding a new product
  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct])
  }
  
  // Handle updating a product
  const handleUpdateProduct = (productId) => {
    // In a real app, this would open an edit form
    console.log(`Editing product with ID: ${productId}`)
    // For now, we'll just show the add product modal as an example
    setShowAddProductModal(true)
  }
  
  // Handle deleting a product
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId))
  }
  
  // Handle updating product discount
  const handleUpdateDiscount = (productId, discountPercent) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, discount: discountPercent }
      }
      return product
    }))
  }
  
  // Handle updating product stock
  const handleUpdateStock = (productId, newStock) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, stock: newStock }
      }
      return product
    }))
  }

  // Admin navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { id: 'inventory', label: 'Inventory', icon: <FiPackage /> },
    { id: 'storage', label: 'Storage', icon: <FiDatabase /> },
    { id: 'discounts', label: 'Discounts', icon: <FiTag /> },
    { id: 'sales', label: 'Sales Analytics', icon: <FiDollarSign /> },
    { id: 'products', label: 'Products', icon: <FiShoppingBag /> },
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Admin Control Panel</h1>
            <p className="text-primary-100">Manage your store, products, and sales</p>
          </div>
          
          {/* Admin Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Admin Content */}
          <div className="p-6">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Store Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Products */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Total Products</p>
                        <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
                      </div>
                      <div className="p-3 bg-blue-500 bg-opacity-20 rounded-full">
                        <FiPackage className="text-blue-700 text-xl" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Low Stock */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Low Stock Items</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {products.filter(p => p.stock < 10).length}
                        </h3>
                      </div>
                      <div className="p-3 bg-amber-500 bg-opacity-20 rounded-full">
                        <FiLayers className="text-amber-700 text-xl" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Active Discounts */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Active Discounts</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {products.filter(p => p.discount > 0).length}
                        </h3>
                      </div>
                      <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
                        <FiTag className="text-green-700 text-xl" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Total Revenue (mock data) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900">$12,845.00</h3>
                      </div>
                      <div className="p-3 bg-purple-500 bg-opacity-20 rounded-full">
                        <FiDollarSign className="text-purple-700 text-xl" />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Sales Analytics Preview */}
                <div className="mb-6">
                  <SalesAnalytics />
                </div>
              </div>
            )}
            
            {/* Inventory Management */}
            {activeTab === 'inventory' && (
              <InventoryManager 
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
            
            {/* Discount Management */}
            {activeTab === 'discounts' && (
              <DiscountManager 
                products={products}
                onUpdateDiscount={handleUpdateDiscount}
              />
            )}
            
            {/* Storage Management */}
            {activeTab === 'storage' && (
              <StorageManager 
                products={products}
                onUpdateStock={handleUpdateStock}
              />
            )}
            
            {/* Sales Analytics */}
            {activeTab === 'sales' && (
              <SalesAnalytics />
            )}
            
            {/* Product Management */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <FiPackage /> Add New Product
                  </button>
                </div>
                
                {/* Product Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {Array.from(new Set(products.map(p => p.category))).map(category => {
                    const categoryProducts = products.filter(p => p.category === category)
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                      >
                        <h3 className="font-semibold text-lg mb-2">{category}</h3>
                        <p className="text-gray-500 mb-4">{categoryProducts.length} products</p>
                        <div className="flex flex-wrap gap-2">
                          {categoryProducts.slice(0, 3).map(product => (
                            <div key={product.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                              <span className="truncate max-w-[150px]">{product.name}</span>
                            </div>
                          ))}
                          {categoryProducts.length > 3 && (
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                              <span>+{categoryProducts.length - 3} more</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                
                {/* Product List */}
                <InventoryManager 
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <AddProductForm 
            onClose={() => setShowAddProductModal(false)} 
            onAddProduct={(product) => {
              handleAddProduct(product)
              setShowAddProductModal(false)
            }} 
          />
        </div>
      )}
    </div>
  )
}

export default AdminPage