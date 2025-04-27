import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiStar, FiHeart, FiPlus, FiMinus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

// Store
import useCartStore from '../../store/cartStore'

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()

  // Helper to determine if product has active discount
  const getActiveDiscount = (product) => {
    if (product.discounts && product.discounts.length > 0) {
      // Find the first active discount
      const activeDiscount = product.discounts.find(d => d.active);
      return activeDiscount ? activeDiscount.value : 0;
    }
    
    // For backward compatibility with old product structure
    if (product.discount) return product.discount;
    
    return 0;
  }

  // Calculate discount and final price
  const discount = getActiveDiscount(product);
  const hasDiscount = discount > 0;
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    return `${price.toFixed(2)} TND`
  }

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100))
  }
  
  const finalPrice = hasDiscount 
    ? getDiscountedPrice(product.price, discount)
    : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    
    try {
      // Add product with processed price information
      addItem({
        ...product,
        price: finalPrice,
        originalPrice: product.price,
        discountPercentage: discount,
        quantity: quantity
      })
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding item to cart:', error)
      toast.error('Failed to add item to cart')
    } finally {
      setIsAdding(false)
      setQuantity(1) // Reset quantity after adding
    }
  }

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <motion.div 
      className="card group h-full flex flex-col"
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="relative overflow-hidden">
          <motion.img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
              {discount}% OFF
            </div>
          )}
          
          {/* Quick action buttons */}
          <motion.div 
            className="absolute bottom-4 right-4 flex flex-col space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleToggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </motion.button>
          </motion.div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
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
          
          <h3 className="text-lg font-bold mb-1 text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center mb-3">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex border rounded-md">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(q => Math.max(1, q - 1));
                  }}
                  className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={14} />
                </button>
                <input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 text-center border-x border-gray-200 focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(q => q + 1);
                  }}
                  className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                >
                  <FiPlus size={14} />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white py-1 px-3 rounded-md transition-colors"
              >
                {isAdding ? (
                  <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                ) : (
                  <FiShoppingCart className="mr-1" size={16} />
                )}
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
