import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import useCartStore from '../store/cartStore';
import { formatPrice, formatDiscount, getOriginalPrice } from '../utils/priceFormatter';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // When adding items with discount, ensure we have the original price information
    if (product.discountPercentage) {
      // Calculate the original price if discount is applied
      const originalPrice = getOriginalPrice(product);
      
      addItem({
        ...product,
        originalPrice: originalPrice
      });
    } else {
      addItem(product);
    }
  };

  // Calculate original price if product has discount
  const originalPrice = product.discountPercentage ? 
    getOriginalPrice(product) : product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      {product.discountPercentage && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {formatDiscount(product.discountPercentage)}
        </div>
      )}
      
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative pb-[100%] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-1 leading-tight line-clamp-2 h-10">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              {product.discountPercentage ? (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-primary-100 p-2 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-300"
            >
              <AiOutlineShoppingCart size={20} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
