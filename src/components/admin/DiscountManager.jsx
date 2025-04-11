import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi'

const DiscountManager = ({ products, onUpdateDiscount }) => {
  const [discounts, setDiscounts] = useState([])
  const [isAddingDiscount, setIsAddingDiscount] = useState(false)
  const [newDiscount, setNewDiscount] = useState({
    productId: '',
    discountPercent: 0,
    startDate: '',
    endDate: ''
  })
  const [editingId, setEditingId] = useState(null)

  // Initialize discounts from products that have discounts
  useEffect(() => {
    const initialDiscounts = products
      .filter(product => product.discount > 0)
      .map(product => ({
        id: `discount-${product.id}`,
        productId: product.id,
        productName: product.name,
        discountPercent: product.discount,
        startDate: new Date().toISOString().split('T')[0], // Today as default
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      }))
    
    setDiscounts(initialDiscounts)
  }, [products])

  const handleAddDiscount = () => {
    if (!newDiscount.productId || newDiscount.discountPercent <= 0) return
    
    const product = products.find(p => p.id.toString() === newDiscount.productId)
    if (!product) return
    
    const newDiscountItem = {
      id: `discount-${Date.now()}`,
      productId: parseInt(newDiscount.productId),
      productName: product.name,
      discountPercent: parseInt(newDiscount.discountPercent),
      startDate: newDiscount.startDate || new Date().toISOString().split('T')[0],
      endDate: newDiscount.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    setDiscounts([...discounts, newDiscountItem])
    onUpdateDiscount(product.id, parseInt(newDiscount.discountPercent))
    
    // Reset form
    setNewDiscount({
      productId: '',
      discountPercent: 0,
      startDate: '',
      endDate: ''
    })
    setIsAddingDiscount(false)
  }

  const handleEditDiscount = (id) => {
    setEditingId(id)
  }

  const handleUpdateDiscount = (id) => {
    const discountToUpdate = discounts.find(d => d.id === id)
    if (!discountToUpdate) return
    
    onUpdateDiscount(discountToUpdate.productId, discountToUpdate.discountPercent)
    setEditingId(null)
  }

  const handleDeleteDiscount = (id) => {
    const discountToDelete = discounts.find(d => d.id === id)
    if (!discountToDelete) return
    
    // Set discount to 0 for the product
    onUpdateDiscount(discountToDelete.productId, 0)
    
    // Remove from discounts list
    setDiscounts(discounts.filter(d => d.id !== id))
  }

  const handleDiscountChange = (id, field, value) => {
    setDiscounts(discounts.map(discount => {
      if (discount.id === id) {
        return { ...discount, [field]: value }
      }
      return discount
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discount Management</h2>
        <button
          onClick={() => setIsAddingDiscount(true)}
          className="btn btn-primary flex items-center gap-2"
          disabled={isAddingDiscount}
        >
          <FiPlus /> Add Discount
        </button>
      </div>

      {/* Add Discount Form */}
      {isAddingDiscount && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">New Discount</h3>
            <button
              onClick={() => setIsAddingDiscount(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={newDiscount.productId}
                onChange={(e) => setNewDiscount({...newDiscount, productId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                min="1"
                max="99"
                value={newDiscount.discountPercent}
                onChange={(e) => setNewDiscount({...newDiscount, discountPercent: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={newDiscount.startDate}
                onChange={(e) => setNewDiscount({...newDiscount, startDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={newDiscount.endDate}
                onChange={(e) => setNewDiscount({...newDiscount, endDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddDiscount}
              className="btn btn-primary"
              disabled={!newDiscount.productId || newDiscount.discountPercent <= 0}
            >
              Add Discount
            </button>
          </div>
        </motion.div>
      )}

      {/* Discounts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No discounts available. Add your first discount!
                </td>
              </tr>
            ) : (
              discounts.map(discount => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {discount.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === discount.id ? (
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={discount.discountPercent}
                        onChange={(e) => handleDiscountChange(discount.id, 'discountPercent', parseInt(e.target.value))}
                        className="w-20 p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="text-accent-500 font-medium">{discount.discountPercent}%</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === discount.id ? (
                      <input
                        type="date"
                        value={discount.startDate}
                        onChange={(e) => handleDiscountChange(discount.id, 'startDate', e.target.value)}
                        className="w-32 p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      new Date(discount.startDate).toLocaleDateString()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === discount.id ? (
                      <input
                        type="date"
                        value={discount.endDate}
                        onChange={(e) => handleDiscountChange(discount.id, 'endDate', e.target.value)}
                        className="w-32 p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      new Date(discount.endDate).toLocaleDateString()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === discount.id ? (
                      <>
                        <button
                          onClick={() => handleUpdateDiscount(discount.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditDiscount(discount.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DiscountManager