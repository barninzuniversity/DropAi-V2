import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi'

// Import ProductContext instead of hardcoded data
import { useProducts } from '../context/ProductContext'

// Components
import ProductCard from '../components/products/ProductCard'

const ProductsPage = () => {
  // Use shared products from context instead of hardcoded data
  const { products: allProducts } = useProducts()
  
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured')
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
  })
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Categories derived from products
  const categories = [...new Set(allProducts.map(product => product.category))]

  // Load products from context
  useEffect(() => {
    setIsLoading(true)
    // Short timeout to simulate loading, can be removed in production
    setTimeout(() => {
      setFilteredProducts(allProducts)
      setIsLoading(false)
    }, 300)
  }, [allProducts])

  // Apply filters and sorting
  useEffect(() => {
    if (allProducts.length === 0) return

    let result = [...allProducts]

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category))
    }

    // Apply price range filter
    result = result.filter(product => {
      // Calculate discounted price if product has active discounts
      const hasActiveDiscount = product.discounts && 
                               product.discounts.length > 0 && 
                               product.discounts[0].active;
                               
      const discount = hasActiveDiscount ? product.discounts[0].value : 0;
      
      const price = discount > 0 
        ? product.price - (product.price * (discount / 100))
        : product.price
        
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Apply rating filter if the property exists
    if (filters.rating > 0) {
      result = result.filter(product => (product.rating || 0) >= filters.rating)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const discountA = a.discounts && a.discounts.length > 0 && a.discounts[0].active ? a.discounts[0].value : 0
          const discountB = b.discounts && b.discounts.length > 0 && b.discounts[0].active ? b.discounts[0].value : 0
          
          const priceA = discountA > 0 ? a.price - (a.price * (discountA / 100)) : a.price
          const priceB = discountB > 0 ? b.price - (b.price * (discountB / 100)) : b.price
          return priceA - priceB
        })
        break
      case 'price-high':
        result.sort((a, b) => {
          const discountA = a.discounts && a.discounts.length > 0 && a.discounts[0].active ? a.discounts[0].value : 0
          const discountB = b.discounts && b.discounts.length > 0 && b.discounts[0].active ? b.discounts[0].value : 0
          
          const priceA = discountA > 0 ? a.price - (a.price * (discountA / 100)) : a.price
          const priceB = discountB > 0 ? b.price - (b.price * (discountB / 100)) : b.price
          return priceB - priceA
        })
        break
      case 'rating':
        // If rating exists, sort by it
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        // Sort by ID (higher ID = newer)
        result.sort((a, b) => b.id - a.id)
        break
      default: // 'featured'
        // Keep original order
        break
    }

    setFilteredProducts(result)
  }, [allProducts, filters, sortBy])

  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }))
  }

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
    })
    setSortBy('featured')
  }

  const toggleFilterSidebar = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  // Format price with TND currency
  const formatPrice = (price) => {
    return `${price} TND`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            All Products
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse our curated collection of premium products, personalized for your unique style and preferences.
          </motion.p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={toggleFilterSidebar}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <FiFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.aside 
            className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-primary-600 text-sm hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">{formatPrice(filters.priceRange[0])}</span>
                    <span className="text-gray-600 text-sm">{formatPrice(filters.priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-bold mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">{rating}+ Stars</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600 mr-2">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className={viewMode === 'grid' ? 
                  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 
                  'space-y-6'}
              >
                {filteredProducts.map(product => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
