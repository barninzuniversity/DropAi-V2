import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingCart, FiStar, FiHeart, FiShare2, FiCheck, FiMinus, FiPlus, FiX, FiMail } from 'react-icons/fi'

// Data
import { allProducts } from '../data/products'

// Store
import useCartStore from '../store/cartStore'

// Components
import ProductRecommendations from '../components/products/ProductRecommendations'

// Utils
import { formatPrice, calculateDiscountedPrice } from '../utils/priceFormatter'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [shareStatus, setShareStatus] = useState({ loading: false, success: false, error: '' })
  const { addItem } = useCartStore()

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      setLoading(true)
      setTimeout(() => {
        const foundProduct = allProducts.find(p => p.id === parseInt(id))
        setProduct(foundProduct || null)
        setLoading(false)
      }, 800)
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      // Calculate original price if product has a discount
      if (product.discount > 0) {
        const originalPrice = product.price;
        const discountedPrice = calculateDiscountedPrice(originalPrice, product.discount);
        
        // Add item with original and discounted price
        const itemWithPriceInfo = {
          ...product,
          originalPrice,
          discountedPrice
        };
        
        addItem(itemWithPriceInfo, quantity);
      } else {
        // Regular product without discount
        addItem(product, quantity);
      }
    }
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(99, quantity + value))
    setQuantity(newQuantity)
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true)
    setShareStatus({ loading: false, success: false, error: '' })
  }

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false)
    setRecipientEmail('')
  }

  const handleShareSubmit = async (e) => {
    e.preventDefault()
    
    // Validate email
    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setShareStatus({ loading: false, success: false, error: 'Please enter a valid email address' })
      return
    }

    setShareStatus({ loading: true, success: false, error: '' })

    try {
      // Import the email service dynamically
      const { shareProductViaEmail } = await import('../utils/emailService')
      
      // Send the product via email
      await shareProductViaEmail(product, recipientEmail)
      
      setShareStatus({ loading: false, success: true, error: '' })
      
      // Reset form after 3 seconds
      setTimeout(() => {
        handleCloseShareModal()
      }, 3000)
    } catch (error) {
      console.error('Failed to share product:', error)
      setShareStatus({ 
        loading: false, 
        success: false, 
        error: 'Failed to share the product. Please try again later.'
      })
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 container">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="flex items-center text-primary-600 hover:underline">
            <FiArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-2">
              <div className="flex text-accent-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm ml-2">{product.reviews} reviews</span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Product Pricing */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary-600 mr-2">
                    {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="ml-2 bg-accent-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center mb-6">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
              <span className="text-sm font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                  disabled={quantity >= 99}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={product.stock <= 0}
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
              <motion.button
                onClick={handleShareClick}
                className="btn btn-outline p-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Share Product"
              >
                <FiShare2 />
              </motion.button>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-bold mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2">
                      <dt className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI-Powered Recommendations Section */}
        <section className="mt-20">
          <div className="border-t border-gray-200 pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
              <ProductRecommendations currentProductId={parseInt(id)} />
            </motion.div>
          </div>
        </section>
      </div>

      {/* Share Product Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Share This Product</h3>
              <button 
                onClick={handleCloseShareModal}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            {shareStatus.success ? (
              <motion.div 
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Product Shared!</h3>
                <p className="text-green-700">
                  The product has been shared successfully with {recipientEmail}.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleShareSubmit}>
                <p className="text-gray-600 mb-4">
                  Share this product with a friend or colleague via email.
                </p>
                
                <div className="mb-4">
                  <label htmlFor="recipientEmail" className="block text-gray-700 font-medium mb-2">
                    Recipient's Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="recipientEmail"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  {shareStatus.error && (
                    <p className="mt-1 text-sm text-red-600">{shareStatus.error}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseShareModal}
                    className="btn btn-outline mr-2"
                    disabled={shareStatus.loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                    disabled={shareStatus.loading}
                  >
                    {shareStatus.loading ? (
                      <>
                        <span className="animate-spin mr-2 inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Share <FiShare2 />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
