import React, { useState } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiEye, FiPackage, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { deleteProduct, updateProductStock } from '../../utils/inventoryService';

const InventoryManager = ({ products, refreshProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // Handle sort click
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle product deletion
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        // Directly use the inventory service
        const result = deleteProduct(productId);
        
        if (result.success) {
          // Refresh products from storage
          refreshProducts();
        } else {
          alert(`Failed to delete product: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle stock update
  const updateStock = (productId, newStock) => {
    if (newStock < 0) return; // Prevent negative stock
    
    setIsUpdatingStock(true);
    try {
      // Assuming updateProductStock is implemented in inventoryService
      const result = updateProductStock(productId, newStock);
      
      if (result.success) {
        // Refresh products from storage
        refreshProducts();
      } else {
        alert(`Failed to update stock: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('An error occurred while updating the stock');
    } finally {
      setIsUpdatingStock(false);
    }
  };

  // Filter and sort products
  const filteredProducts = [...products]
    .filter(product => 
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.id).includes(searchTerm)
    )
    .sort((a, b) => {
      // Handle different sort fields
      if (['price', 'stock'].includes(sortField)) {
        // Numeric sort
        const aValue = Number(a[sortField] || 0);
        const bValue = Number(b[sortField] || 0);
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // String sort
        const aValue = String(a[sortField] || '').toLowerCase();
        const bValue = String(b[sortField] || '').toLowerCase();
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
    });

  return (
    <div className="inventory-manager">
      <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
      
      {/* Search and Add */}
      <div className="flex justify-between mb-6">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search by name, category, or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          onClick={() => window.location.href = '/admin/add-product'}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FiPlus className="mr-2" /> Add Product
        </button>
      </div>
      
      {/* Products Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Product {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category {sortField === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                Stock {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.image ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiPackage className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(product.price || 0).toFixed(2)}
                    {product.discount > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {product.discount}% OFF
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (product.stock || 0) === 0
                          ? 'bg-red-100 text-red-800'
                          : (product.stock || 0) < 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock || 0} in stock
                      </span>
                      <div className="ml-3 flex space-x-1">
                        <button
                          onClick={() => updateStock(product.id, (product.stock || 0) + 1)}
                          disabled={isUpdatingStock}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Increase Stock"
                        >
                          <FiPlusCircle size={16} />
                        </button>
                        <button
                          onClick={() => updateStock(product.id, Math.max(0, (product.stock || 0) - 1))}
                          disabled={isUpdatingStock || (product.stock || 0) === 0}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Decrease Stock"
                        >
                          <FiMinusCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                      className="text-indigo-600 hover:text-indigo-900 mx-2"
                      title="View Product"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => window.location.href = `/admin/edit-product/${product.id}`}
                      className="text-blue-600 hover:text-blue-900 mx-2"
                      title="Edit Product"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 mx-2"
                      disabled={isDeleting}
                      title="Delete Product"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No products match your search.' : 'No products available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Products count and inventory summary */}
      <div className="mt-4 flex justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
        <div className="text-sm">
          <span className="font-medium">Inventory Summary: </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
            {products.filter(p => (p.stock || 0) > 10).length} Well Stocked
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
            {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length} Low Stock
          </span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            {products.filter(p => (p.stock || 0) === 0).length} Out of Stock
          </span>
        </div>
      </div>
      
      {/* Button to refresh data */}
      <div className="mt-6">
        <button
          onClick={refreshProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Refresh Products
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Click to update the product list from storage.
        </p>
      </div>
    </div>
  );
};

export default InventoryManager;
