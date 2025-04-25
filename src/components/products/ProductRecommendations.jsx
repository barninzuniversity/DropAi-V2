import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useProducts } from '../../context/ProductContext';

const ProductRecommendations = ({ userPreferences }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { products } = useProducts();

  useEffect(() => {
    if (!products.length) return;

    // Get recommended products based on user preferences
    const getRecommendedProducts = () => {
      let filteredProducts = [...products];
      
      // Filter by user's preferred categories if they exist
      if (userPreferences?.categories?.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          userPreferences.categories.some(category => 
            product.category.toLowerCase().includes(category.toLowerCase())
          )
        );
      }
      
      // Filter by price range if specified
      if (userPreferences?.priceRange?.length === 2) {
        const [minPrice, maxPrice] = userPreferences.priceRange;
        filteredProducts = filteredProducts.filter(
          product => {
            const price = product.discount 
              ? product.price - (product.price * (product.discount / 100))
              : product.price;
            return price >= minPrice && price <= maxPrice;
          }
        );
      }
      
      // If no products match the filters, provide some default recommendations
      if (filteredProducts.length === 0) {
        // Sort products by highest rating and return top items
        return products
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
      }
      
      // Sort filtered products by rating to get "best" recommendations
      return filteredProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
    };

    const recommendedProducts = getRecommendedProducts();
    setRecommendations(recommendedProducts);
    setIsLoading(false);
  }, [products, userPreferences]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link to={`/products/${product.id}`}>
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-primary-600 font-medium">
                    {product.discount ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          ${product.price.toFixed(2)}
                        </span>
                        ${(product.price - (product.price * (product.discount / 100))).toFixed(2)}
                      </>
                    ) : (
                      `$${product.price.toFixed(2)}`
                    )}
                  </p>
                  {product.rating && (
                    <div className="flex items-center text-yellow-400">
                      <span className="mr-1">★</span>
                      <span className="text-gray-600">{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <Link
          to="/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          View All Products <FiArrowRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProductRecommendations;
