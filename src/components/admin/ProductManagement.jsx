import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { calculateDiscountedPrice } from '../../utils/priceFormatter';

const ProductManagement = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('soft'); // 'soft' or 'hard'
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    discount: 0,
    category: '',
    description: '',
    inventory: 0,
    image: ''
  });

  useEffect(() => {
    // Filter products based on search term
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(lowercasedTerm) ||
        product.category.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      discount: product.discount || 0,
      category: product.category,
      description: product.description || '',
      inventory: product.inventory || 0,
      image: product.image
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'price' || name === 'discount' || name === 'inventory') {
      setEditForm({
        ...editForm,
        [name]: parseFloat(value) || 0
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
    
    // If modifying price or discount, calculate the final price
    if (name === 'price' || name === 'discount') {
      const price = name === 'price' ? parseFloat(value) || 0 : editForm.price;
      const discount = name === 'discount' ? parseFloat(value) || 0 : editForm.discount;
      
      // Calculate final price with discount
      const finalPrice = calculateDiscountedPrice(price, discount);
      
      // You could set this in a separate state if you want to display it in the form
      console.log('Final price with discount:', finalPrice);
    }
  };

  const handleEditSubmit = () => {
    // Calculate finalPrice based on price and discount
    const finalPrice = calculateDiscountedPrice(editForm.price, editForm.discount);
    
    // Update product with both original price and discount information
    onUpdateProduct(editingId, {
      ...editForm,
      finalPrice: finalPrice,
      originalPrice: editForm.price,
      discountPercentage: editForm.discount
    });
    
    setEditingId(null);
  };

  const handleDeleteClick = (product, type = 'soft') => {
    setProductToDelete(product);
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    
    if (deleteType === 'hard') {
      // Permanently delete the product
      onDeleteProduct(productToDelete.id, true);
    } else {
      // Soft delete - mark as deleted but keep in database
      onDeleteProduct(productToDelete.id, false);
    }
    
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => {/* Handle add product logic */}}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => {
              // Calculate final price with discount
              const finalPrice = product.finalPrice || 
                calculateDiscountedPrice(product.price, product.discount || 0);
              
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="w-full p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="w-24 p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      `${product.price.toFixed(2)} TND`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="discount"
                          min="0"
                          max="99"
                          value={editForm.discount}
                          onChange={handleEditChange}
                          className="w-20 p-1 border border-gray-300 rounded-md"
                        />
                        <span className="ml-1">%</span>
                      </div>
                    ) : (
                      product.discount ? `${product.discount}%` : "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <span className="text-green-600">{calculateDiscountedPrice(editForm.price, editForm.discount).toFixed(2)} TND</span>
                    ) : (
                      <span className={product.discount ? "text-green-600 font-medium" : ""}>
                        {finalPrice.toFixed(2)} TND
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        name="inventory"
                        min="0"
                        value={editForm.inventory}
                        onChange={handleEditChange}
                        className="w-20 p-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      product.inventory || 0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === product.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleEditSubmit}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to {deleteType === 'hard' ? 'permanently delete' : 'delete'} the product "{productToDelete?.name}"?
              {deleteType !== 'hard' && (
                <span className="block mt-2 text-gray-600 text-sm">
                  Note: The product will be marked as deleted but can be restored later.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-2">
              {deleteType !== 'hard' && (
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => {
                    setDeleteType('hard');
                  }}
                >
                  <FiTrash2 className="inline mr-1" /> Delete Permanently
                </button>
              )}
              <button 
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={cancelDelete}
              >
                <FiX className="inline mr-1" /> Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                onClick={confirmDelete}
              >
                <FiCheck className="inline mr-1" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
