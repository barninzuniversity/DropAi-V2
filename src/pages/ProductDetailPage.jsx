import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingCart, FiStar, FiHeart, FiShare2, FiCheck, FiMinus, FiPlus, FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

// Context and hooks
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext' 

// Simplified product detail page with robust error handling
const ProductDetailPage = () => {
  const { id } = useParams()
  const { products } = useProducts()
  const { addItem } = useCart()
  
  // State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Fetch product
  useEffect(() => {
    setLoading(true)
    
    // Helper function to normalize ID comparison
    const matchesId = (productId, paramId) => {
      return String(productId) === String(paramId)
    }
    
    // Find product with more robust ID handling
    const foundProduct = products.find(p => matchesId(p.id, id))
    
    if (foundProduct) {
      console.log("Found product:", foundProduct)
      setProduct(foundProduct)
    } else {
      console.error("Product not found with ID:", id)
      // Check what products are available for debugging
      console.log("Available products:", products.map(p => ({ id: p.id, name: p.name })))
    }
    
    setLoading(false)
  }, [id, products])
  
  // Simplified add to cart
  const handleAddToCart = () => {
    if (!product) return
    
    // Create a clean product object with the most important properties
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || (product.images && product.images.length > 0 ? product.images[0] : null),
      quantity: quantity
    }
    
    // Add discount information if available
    if (product.discount) {
      productToAdd.discount = product.discount
    }
    
    addItem(productToAdd, quantity)
    toast.success(`${product.name} added to cart!`)
  }
  
  // Quantity handlers
  const incrementQuantity = () => setQuantity(q => q + 1)
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1))
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) {
      setQuantity(val)
    }
  }
  
  // Toggle favorite status
  const handleFavoriteToggle = () => setIsFavorite(!isFavorite)
  
  // Loading state
  if (loading) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }
  
  // Product not found state
  if (!product) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }
  
  // Prepare images with fallbacks
  const productImage = product.image || 
    (product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600x400?text=Product+Image')
  
  // Format price helper
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`
  }
  
  // Calculate discounted price if applicable
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price
  
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Back to products link */}
        <div className="mb-8">
          <Link to="/products" className="flex items-center text-primary-600 hover:underline">
            <FiArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 h-96 flex items-center justify-center">
              <img 
                src={productImage} 
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Product+Image'
                }}
              />
              
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Price Display */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary-600 mr-2">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-700 mb-6">
              {product.description || "Experience this high-quality product designed for your needs."}
            </p>
            
            {/* In Stock Status */}
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-green-600">
                In Stock
              </span>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={incrementQuantity}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 btn btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiShoppingCart /> Add to Cart
              </motion.button>
              
              <motion.button
                onClick={handleFavoriteToggle}
                className={`btn flex-1 flex items-center justify-center gap-2 ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'btn-outline'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiHeart className={isFavorite ? 'fill-current' : ''} /> {isFavorite ? 'Saved' : 'Save'}
              </motion.button>
            </div>
            
            {/* Category & Details */}
            <div>
              <h3 className="text-lg font-bold mb-3">Product Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-2">
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="font-medium">{product.category || 'Uncategorized'}</dd>
                  </div>
                  
                  {product.rating && (
                    <div className="grid grid-cols-2">
                      <dt className="text-gray-600">Rating</dt>
                      <dd className="font-medium flex items-center">
                        <span className="text-accent-500 mr-1">★</span> 
                        {product.rating}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage