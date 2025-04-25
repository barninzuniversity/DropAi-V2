import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import AdminNavigation from '../components/admin/AdminNavigation';
import { useProducts } from '../context/ProductContext'; // Import the ProductContext hook
import useAuthStore from '../store/authStore'

// ===================== MOCK DATA =====================
const mockOrders = [
  { 
    id: 1, 
    customerName: 'John Doe', 
    email: 'john@example.com',
    date: '2023-09-15', 
    status: 'completed', 
    total: 249.99,
    items: [
      { id: 1, productId: 1, name: 'Modern Chair', quantity: 1, price: 149.99 },
      { id: 2, productId: 4, name: 'Ceramic Vase', quantity: 2, price: 49.99 }
    ]
  },
  { 
    id: 2, 
    customerName: 'Jane Smith', 
    email: 'jane@example.com',
    date: '2023-09-14', 
    status: 'processing', 
    total: 89.99,
    items: [
      { id: 3, productId: 2, name: 'Designer Lamp', quantity: 1, price: 89.99 }
    ]
  },
  { 
    id: 3, 
    customerName: 'Bob Johnson', 
    email: 'bob@example.com',
    date: '2023-09-13', 
    status: 'cancelled', 
    total: 249.99,
    items: [
      { id: 4, productId: 3, name: 'Wooden Table', quantity: 1, price: 249.99 }
    ]
  }
];

// Removed inventoryProductsInit as it's no longer needed (using ProductContext instead)

const storageLocations = [
  { id: 1, name: 'Warehouse A', address: '123 Main St', capacity: 5000, used: 3750 },
  { id: 2, name: 'Warehouse B', address: '456 Oak Ave', capacity: 3000, used: 1800 },
  { id: 3, name: 'Warehouse C', address: '789 Pine Rd', capacity: 2000, used: 1200 },
];
const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 548.95 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 329.99 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 2, totalSpent: 249.99 },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', orders: 7, totalSpent: 812.45 },
  { id: 5, name: 'Michael Brown', email: 'michael@example.com', orders: 1, totalSpent: 89.99 }
];
const mockDiscounts = [
  { id: 1, name: 'Summer Sale', type: 'percentage', value: 15, active: true, applies: 'category', target: 'Furniture' },
  { id: 2, name: 'New Customer', type: 'percentage', value: 10, active: true, applies: 'all', target: null },
  { id: 3, name: 'Clearance', type: 'percentage', value: 25, active: false, applies: 'products', target: 'Selected Products' },
  { id: 4, name: 'Holiday Special', type: 'fixed', value: 20, active: false, applies: 'category', target: 'Decor' },
];

// ========== Dashboard Card ==========
const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
    </div>
  </div>
);

// ========== Dashboard ==========
const Dashboard = () => {
  // Use products from context instead of inventoryProductsInit
  const { products } = useProducts();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin dashboard</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Products" value={products.length} />
        <DashboardCard title="Total Orders" value={mockOrders.length} />
        <DashboardCard title="Warehouses" value={storageLocations.length} />
      </div>
    </div>
  );
};

// ========== Product Management ==========
const ProductManagement = () => {
  const navigate = useNavigate();
  
  // Use context instead of local state
  const { products, updateProduct, deleteProduct } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  
  const categories = [...new Set(products.map(product => product.category))];
  const locations = [...new Set(products.map(product => product.location))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    const matchesLocation = filterLocation === '' || product.location === filterLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleAddDiscount = (productId) => {
    navigate(`/admin/products/${productId}/discount`);
  };
  
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Use context's deleteProduct instead of local state
      deleteProduct(productId);
    }
  };
  
  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleRemoveDiscount = (productId) => {
    // Find the product and create a new version with empty discounts array
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedProduct = { ...product, discounts: [] };
      updateProduct(updatedProduct);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-48">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
          <select
            id="location"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-200">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold
                ${product.stock > 10 ? 'bg-green-100 text-green-800' : 
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
              {product.discounts && product.discounts.length > 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {product.discounts[0].value}% OFF
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="text-right">
                  {product.discounts && product.discounts.length > 0 ? (
                    <>
                      <p className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</p>
                      <p className="text-red-600 font-bold">
                        ${(product.price * (1 - product.discounts[0].value / 100)).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-700 font-bold">${product.price.toFixed(2)}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p>Category: {product.category}</p>
                <p>Storage: {product.location}</p>
                <div className="mt-2">
                  {product.discounts && product.discounts.length > 0 ? (
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Active Discounts:</p>
                      {product.discounts.map(discount => (
                        <div key={discount.id} className="flex items-center">
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {discount.name}: {discount.value}% off
                          </span>
                          <button 
                            className="ml-2 text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Use context-aware function instead of local state update
                              handleRemoveDiscount(product.id);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No discounts applied</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <button 
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleAddDiscount(product.id)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-2 rounded text-sm"
                >
                  {product.discounts && product.discounts.length > 0 ? 'Edit Discount' : 'Add Discount'}
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1 px-2 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-lg shadow text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || filterCategory || filterLocation
                ? "Try adjusting your search or filter criteria." 
                : "Get started by adding your first product."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin/products/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
              >
                <span className="mr-2">+</span>
                Add New Product
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Add new product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ========== Product Form ==========
const ProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    location: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use product context instead of local state
  const { products, addProduct, updateProduct } = useProducts();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.includes('edit')) {
      const id = parseInt(pathParts[pathParts.indexOf('edit') - 1]);
      setIsEditMode(true);
      setProductId(id);

      // Use products from context instead of inventoryProductsInit
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description || '',
          category: product.category,
          stock: product.stock.toString(),
          location: product.location
        });
        setImagePreview(product.image || null);
      }
    }
  }, [location.pathname, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create product object for adding/updating
    const productData = {
      id: isEditMode ? productId : Math.max(0, ...products.map(p => p.id)) + 1,
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      stock: parseInt(formData.stock),
      location: formData.location,
      image: imagePreview,
      // Keep existing discounts if editing, empty array if new product
      discounts: isEditMode ? 
        (products.find(p => p.id === productId)?.discounts || []) : 
        []
    };

    setTimeout(() => {
      // Use context methods instead of just navigating
      if (isEditMode) {
        updateProduct(productData);
      } else {
        addProduct(productData);
      }
      navigate('/admin/products');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Furniture">Furniture</option>
                <option value="Lighting">Lighting</option>
                <option value="Decor">Decor</option>
                <option value="Electronics">Electronics</option>
                <option value="Kitchenware">Kitchenware</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
                rows="4"
              ></textarea>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input 
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location *</label>
              <select 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Storage Location</option>
                {storageLocations.map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="mt-1 flex flex-col items-center">
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center bg-gray-50 mb-4 overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              `${isEditMode ? 'Update' : 'Save'} Product`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ========== Orders, Customers, Discounts, Storage, Settings ==========
const OrdersManagement = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>
      <p className="text-gray-600">View and manage customer orders.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="py-2 px-4">{order.id}</td>
              <td className="py-2 px-4">{order.customerName}</td>
              <td className="py-2 px-4">{order.email}</td>
              <td className="py-2 px-4">{order.date}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold
                  ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4 font-bold">${order.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


// Continuing from where the file was truncated at CustomersManagement...

const CustomersManagement = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="text-gray-600">Your dropshipping store&apos;s customer base at a glance.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Orders</th>
            <th className="py-2 px-4 text-left">Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {mockCustomers.map(c => (
            <tr key={c.id} className="border-t">
              <td className="py-2 px-4">{c.name}</td>
              <td className="py-2 px-4">{c.email}</td>
              <td className="py-2 px-4">{c.orders}</td>
              <td className="py-2 px-4 font-bold">${c.totalSpent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DiscountsManagement = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold">Discounts</h1>
      <p className="text-gray-600">Manage current and past discount campaigns.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Type</th>
            <th className="py-2 px-4 text-left">Value</th>
            <th className="py-2 px-4 text-left">Applies</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockDiscounts.map(discount => (
            <tr key={discount.id} className="border-t">
              <td className="py-2 px-4">{discount.name}</td>
              <td className="py-2 px-4 capitalize">{discount.type}</td>
              <td className="py-2 px-4">
                {discount.type === 'percentage'
                  ? `${discount.value}%`
                  : `$${discount.value.toFixed(2)}`}
              </td>
              <td className="py-2 px-4 capitalize">
                {discount.applies === 'category'
                  ? `Category: ${discount.target}`
                  : discount.applies === 'products'
                    ? discount.target
                    : 'All'}
              </td>
              <td className="py-2 px-4">
                {discount.active
                  ? <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Active</span>
                  : <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Inactive</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StorageManagement = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold">Warehouses &amp; Storage</h1>
      <p className="text-gray-600">Keep track of all storage locations.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Location</th>
            <th className="py-2 px-4 text-left">Address</th>
            <th className="py-2 px-4 text-left">Capacity</th>
            <th className="py-2 px-4 text-left">Used</th>
          </tr>
        </thead>
        <tbody>
          {storageLocations.map(loc => (
            <tr key={loc.id} className="border-t">
              <td className="py-2 px-4">{loc.name}</td>
              <td className="py-2 px-4">{loc.address}</td>
              <td className="py-2 px-4">{loc.capacity} sqft</td>
              <td className="py-2 px-4 font-bold">{loc.used} sqft</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-gray-600">General admin settings (profile, password, etc.)</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p>Settings form goes here...</p>
    </div>
  </div>
);

// ========== Discount Form Component ==========
const DiscountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, updateProduct } = useProducts();
  
  const [productId, setProductId] = useState(null);
  const [discountData, setDiscountData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.includes('discount')) {
      const id = parseInt(pathParts[pathParts.indexOf('discount') - 1]);
      setProductId(id);
      
      // Find product and existing discount
      const product = products.find(p => p.id === id);
      if (product && product.discounts && product.discounts.length > 0) {
        const discount = product.discounts[0]; // Assuming one discount for simplicity
        setDiscountData({
          name: discount.name,
          type: discount.type,
          value: discount.value.toString(),
          active: discount.active
        });
      }
    }
  }, [location.pathname, products]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDiscountData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Find the product
    const product = products.find(p => p.id === productId);
    if (product) {
      // Create discount object
      const discountObject = {
        id: product.discounts && product.discounts.length > 0 ? 
          product.discounts[0].id : 
          Date.now(), // Simple ID generation
        name: discountData.name,
        type: discountData.type,
        value: parseFloat(discountData.value),
        active: discountData.active
      };
      
      // Update product with new discount
      const updatedProduct = {
        ...product,
        discounts: [discountObject] // Replace any existing discounts
      };
      
      setTimeout(() => {
        updateProduct(updatedProduct);
        navigate('/admin/products');
      }, 800);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xl mx-auto">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          Manage Product Discount
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Name *</label>
            <input 
              type="text" 
              name="name"
              value={discountData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g. Summer Sale, New Customer, etc."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
            <select 
              name="type"
              value={discountData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {discountData.type === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount ($) *'}
            </label>
            <input 
              type="number" 
              name="value"
              value={discountData.value}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder={discountData.type === 'percentage' ? '10' : '5.99'}
              min="0"
              step={discountData.type === 'percentage' ? '1' : '0.01'}
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={discountData.active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Active (discount will be applied to product)
            </label>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Discount'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ========== MAIN ADMIN PAGE ==========
const AdminPage = () => {
  // Could add authentication check here
  // const { currentUser } = useAuth();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!currentUser || !currentUser.isAdmin) {
  //     navigate('/login');
  //   }
  // }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 flex-shrink-0 lg:h-screen lg:fixed z-30">
        <AdminNavigation />
      </aside>
      <main className="lg:ml-64 flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="products/:id/discount" element={<DiscountForm />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="customers" element={<CustomersManagement />} />
            <Route path="discounts" element={<DiscountsManagement />} />
            <Route path="storage" element={<StorageManagement />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
