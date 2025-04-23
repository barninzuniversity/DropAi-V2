import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { getAllProducts } from '../../data/products';

const ProductRecommendations = ({ userPreferences }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get all available products
    const products = getAllProducts();
    
    // Simulate AI recommendation logic
    const getRecommendedProducts = () => {
      // Filter products based on user preferences
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
          product => product.price >= minPrice && product.price <= maxPrice
        );
      }
      
      // If no products match the filters, provide some default recommendations
      if (filteredProducts.length === 0) {
        // Sort products by highest rating and return top items
        return products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
      }
      
      // Sort filtered products by rating to get "best" recommendations
      return filteredProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    };

    // Simulate an API call with a slight delay for realism
    setTimeout(() => {
      const recommendedProducts = getRecommendedProducts();
      setRecommendations(recommendedProducts);
      setIsLoading(false);
    }, 800);
  }, [userPreferences]);
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  
  // Calculate final price after discount
  const calculateFinalPrice = (price, discount) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };
  
  // Get appropriate product image with fallback
  const getProductImage = (product) => {
    // Check if the product has valid images
    if (!product.images || product.images.length === 0) {
      return 'https://via.placeholder.com/400x300?text=Product+Image';
    }
    
    // Images in the data might be incomplete URLs, make sure they're complete
    const imageUrl = product.images[0];
    
    // Check if the URL includes https:// already
    if (imageUrl.startsWith('http')) {
      return `${imageUrl}?w=400&h=300&fit=crop&auto=format`;
    }
    
    // Add missing protocol and domain to make a complete URL
    return `https://images.unsplash.com${imageUrl}?w=400&h=300&fit=crop&auto=format`;
  };
  
  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex space-x-2 items-center mb-6">
          <div className="w-6 h-6 bg-primary-100 animate-pulse rounded-full"></div>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white">
              <div className="h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-3"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use placeholder data if recommendations are empty
  const placeholderProducts = [
    {
      id: "placeholder-1",
      name: "Wireless Headphones",
      price: 149.99,
      discount: 10,
      rating: 4.8,
      category: "Audio"
    },
    {
      id: "placeholder-2",
      name: "Smart Watch",
      price: 199.99,
      discount: 0,
      rating: 4.6,
      category: "Wearables"
    },
    {
      id: "placeholder-3",
      name: "Laptop Stand",
      price: 49.99,
      discount: 5,
      rating: 4.7,
      category: "Accessories"
    }
  ];
  
  // Use actual recommendations if available, otherwise use placeholders
  const displayProducts = recommendations.length > 0 ? recommendations : placeholderProducts;
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <span className="w-6 h-6 bg-primary-100 flex items-center justify-center rounded-full text-primary-600 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          <h3 className="text-lg font-bold">AI-Powered Recommendations</h3>
        </div>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
          View all products <FiArrowRight className="ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <motion.div 
            key={product.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Link to={`/products/${product.id}`}>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 h-48">
                {product.id.startsWith('placeholder') ? (
                  // Use a colored placeholder for demo products
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                    <span className="text-primary-600 font-bold text-xl">{product.category}</span>
                  </div>
                ) : (
                  <img 
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                    }}
                  />
                )}
              </div>
                <div className="p-4">
                  <h4 className="font-bold mb-2 line-clamp-2 h-12">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="text-primary-600 font-medium mr-2">
                            {formatPrice(calculateFinalPrice(product.price, product.discount))}
                          </span>
                          <span className="text-gray-400 text-sm line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary-600 font-medium">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full inline-block">
                    Recommended for you
                  </div>
                </div>
              </Link>
            </motion.div>
        ))}
      </div>
      
      {userPreferences && (
        <motion.div 
          className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            <span className="font-medium">Why these recommendations?</span> Our AI analyzed your preferences for
            {userPreferences?.categories?.map((cat, i) => (
              <span key={i} className="font-medium"> {cat}{i < userPreferences.categories.length - 1 ? ',' : ''}</span>
            ))}
            {userPreferences?.priceRange && (
              <span> in the price range of {formatPrice(userPreferences.priceRange[0])} - {formatPrice(userPreferences.priceRange[1])}</span>
            )}
            .
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductRecommendations;
