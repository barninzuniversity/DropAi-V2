import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGrid = ({ products, title, filters = true }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    // Update filtered products when products prop changes
    setFilteredProducts(products);
    
    // Find the maximum price in the products array
    if (products.length > 0) {
      const highestPrice = Math.ceil(
        Math.max(...products.map(product => product.price))
      );
      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
    }
  }, [products]);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sort products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(result);
  }, [activeCategory, sortBy, priceRange, products]);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div>
      {/* Title and Filter Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title || 'Products'}</h2>
        {filters && (
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 hover:text-primary-600 md:hidden"
          >
            {showFilters ? (
              <>
                <FiX className="mr-1" /> Close Filters
              </>
            ) : (
              <>
                <FiFilter className="mr-1" /> Filters
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {filters && (
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-1 bg-white p-4 rounded-lg shadow-md overflow-hidden mb-6 md:mb-0"
              >
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-bold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`block w-full text-left px-2 py-1 rounded-md ${
                            activeCategory === category
                              ? 'bg-primary-100 text-primary-600'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-bold mb-3">Price Range</h3>
                    <div className="px-2">
                      <div className="flex justify-between mb-2">
                        <span>{priceRange[0]} TND</span>
                        <span>{priceRange[1]} TND</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => 
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <h3 className="font-bold mb-3">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="default">Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {/* Products Grid */}
        <div className={`${filters ? 'md:col-span-3' : 'md:col-span-4'}`}>
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setPriceRange([0, maxPrice]);
                  setSortBy('default');
                }}
                className="text-primary-600 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;