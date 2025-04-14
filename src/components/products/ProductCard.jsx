import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi'

// Store
import useCartStore from '../../store/cartStore'

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCartStore()

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `${price.toFixed(2)} TND`
  }

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100))
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
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
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
              {product.discount}% OFF
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
            <motion.button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiShoppingCart />
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
          
          <div className="mt-auto flex items-center">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(getDiscountedPrice(product.price, product.discount))}
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
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
