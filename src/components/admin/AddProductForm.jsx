import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiPlus } from 'react-icons/fi'

const AddProductForm = ({ onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    category: '',
    stock: '',
    image: '',
    images: ['', '', ''],
    tags: '',
    features: ['', '', '', '', ''],
    specifications: {
      brand: '',
      model: '',
      weight: '',
      dimensions: ''
    }
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      // Handle nested objects (specifications)
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else if (name === 'tags') {
      // Handle tags as comma-separated string
      setFormData({
        ...formData,
        [name]: value
      })
    } else if (name.startsWith('features[') || name.startsWith('images[')) {
      // Handle array items
      const match = name.match(/\[(\d+)\]$/)
      if (match) {
        const index = parseInt(match[1])
        const fieldName = name.split('[')[0]
        const newArray = [...formData[fieldName]]
        newArray[index] = value
        setFormData({
          ...formData,
          [fieldName]: newArray
        })
      }
    } else {
      // Handle regular fields
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }
    if (!formData.image.trim()) newErrors.image = 'Main image URL is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Process the data for submission
      const processedData = {
        ...formData,
        id: Date.now(), // Generate a temporary ID (would be handled by backend in production)
        price: parseFloat(formData.price),
        discount: parseInt(formData.discount) || 0,
        stock: parseInt(formData.stock),
        rating: 0, // Default rating for new products
        reviews: 0, // Default reviews count for new products
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        // Filter out empty feature entries
        features: formData.features.filter(feature => feature.trim() !== ''),
        // Filter out empty image URLs
        images: [formData.image, ...formData.images.filter(img => img.trim() !== '')]
      }
      
      onAddProduct(processedData)
      onClose()
    }
  }

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    })
  }

  const handleRemoveFeature = (index) => {
    const newFeatures = [...formData.features]
    newFeatures.splice(index, 1)
    setFormData({
      ...formData,
      features: newFeatures
    })
  }

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    })
  }

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData({
      ...formData,
      images: newImages
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[80vh] p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full p-3 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">
                      Price ($)*
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full p-3 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="discount">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                      Category*
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stock">
                      Stock Quantity*
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full p-3 border rounded-md ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tags">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. wireless, bluetooth, audio"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Images and Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Images & Features</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="image">
                    Main Image URL*
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full p-3 border rounded-l-md ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formData.image && (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-md">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                        />
                      </div>
                    )}
                  </div>
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Additional Images
                  </label>
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        name={`images[${index}]`}
                        value={img}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full p-3 border border-gray-300 rounded-l-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="mt-2 flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <FiPlus className="mr-1" /> Add Another Image
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Product Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        name={`features[${index}]`}
                        value={feature}
                        onChange={handleChange}
                        placeholder={`Feature ${index + 1}`}
                        className="w-full p-3 border border-gray-300 rounded-l-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="px-3 bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="mt-2 flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <FiPlus className="mr-1" /> Add Another Feature
                  </button>
                </div>
              </div>
            </div>
            
            {/* Specifications */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="specifications.brand">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="specifications.brand"
                    name="specifications.brand"
                    value={formData.specifications.brand}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="specifications.model">
                    Model
                  </label>
                  <input
                    type="text"
                    id="specifications.model"
                    name="specifications.model"
                    value={formData.specifications.model}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="specifications.weight">
                    Weight
                  </label>
                  <input
                    type="text"
                    id="specifications.weight"
                    name="specifications.weight"
                    value={formData.specifications.weight}
                    onChange={handleChange}
                    placeholder="e.g. 250g"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="specifications.dimensions">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    id="specifications.dimensions"
                    name="specifications.dimensions"
                    value={formData.specifications.dimensions}
                    onChange={handleChange}
                    placeholder='e.g. 5.8" x 2.8" x 0.3"'
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AddProductForm