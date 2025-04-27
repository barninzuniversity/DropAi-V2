import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingCart, FiStar, FiHeart, FiShare2, FiCheck, FiMinus, FiPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

// Store
import useCartStore from '../store/cartStore'
import { useProducts } from '../context/ProductContext'

// Simplified product detail page with robust error handling
const ProductDetailPage = () => {
  const { id } = useParams()
  const { products } = useProducts()
  const { addItem } = useCartStore()
  
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
  
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }
  
  const handleAddToCart = () => {
    if (!product) return

    const success = addItem(product, quantity)
    if (success) {
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`)
    } else {
      toast.error('Failed to add to cart. Item may be out of stock.')
    }
  }
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }
  
  // Product not found state
  if (!product) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link to="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <button 
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <FiHeart className="text-xl" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-gray-600">(4.0)</span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {product.price.toFixed(2)} TND
                </h2>
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <FiCheck className="mr-2" />
                    <span>In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="text-red-600">Out of Stock</div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">
                  {product.description || 'No description available.'}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 rounded-md border hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 rounded-md border hover:bg-gray-50"
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage