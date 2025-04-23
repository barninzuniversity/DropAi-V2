import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'

// Data
import { getAllProducts } from '../../data/products'

const EnhancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [products, setProducts] = useState([])
  const [selectedResult, setSelectedResult] = useState(-1)
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Load products when component mounts
  useEffect(() => {
    setProducts(getAllProducts())
  }, [])

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100))
  }

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  // Perform search when searchTerm changes
  useEffect(() => {
    if (searchTerm.length > 2 && products.length > 0) {
      setIsSearching(true)
      setShowResults(true)
      
      // Simulate search with a delay
      const searchTimeout = setTimeout(() => {
        // Basic search implementation
        const results = products.filter(product => {
          const searchLower = searchTerm.toLowerCase()
          
          // Check if search term is in product name, description, category, or tags
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
          )
        })
        
        // Sort results by relevance
        results.sort((a, b) => {
          // Products with search term in name are prioritized
          const aInName = a.name.toLowerCase().includes(searchTerm.toLowerCase())
          const bInName = b.name.toLowerCase().includes(searchTerm.toLowerCase())
          
          if (aInName && !bInName) return -1
          if (!aInName && bInName) return 1
          
          // Then sort by rating
          return b.rating - a.rating
        })
        
        setSearchResults(results.slice(0, 6)) // Limit to 6 results
        setIsSearching(false)
        
        // Save to recent searches if not already there
        if (searchTerm.trim() !== '') {
          setRecentSearches(prev => {
            const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5)
            localStorage.setItem('recentSearches', JSON.stringify(updated))
            return updated
          })
        }
      }, 300) // Reduced delay for better responsiveness
      
      return () => clearTimeout(searchTimeout)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchTerm, products])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setSelectedResult(-1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setShowResults(false)
    }
  }

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term)
    inputRef.current.focus()
  }

  const clearSearch = () => {
    setSearchTerm('')
    setShowResults(false)
    setSelectedResult(-1)
    inputRef.current.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`)
    setShowResults(false)
    setSearchTerm('')
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedResult(prev => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedResult(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedResult >= 0) {
      e.preventDefault()
      if (searchResults[selectedResult]) {
        navigateToProduct(searchResults[selectedResult].id)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setShowResults(false)
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          ref={inputRef}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="input pl-10 pr-10 w-full"
          placeholder="Search products..."
          aria-label="Search products"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showResults && (searchTerm.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >

            {/* Recent Searches */}
            {recentSearches.length > 0 && searchTerm.length === 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <FiTrendingUp className="mr-1" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>
                <ul>
                  {recentSearches.map((term, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleRecentSearchClick(term)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center"
                      >
                        <FiSearch className="mr-2 text-gray-400" />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Search Results */}
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600 mb-2"></div>
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : (
              searchResults.length > 0 && (
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{searchResults.length} results found</span>
                      <Link to={`/products?search=${encodeURIComponent(searchTerm)}`} className="text-xs text-primary-600 hover:text-primary-700">
                        View All Results
                      </Link>
                    </div>
                    <ul>
                      {searchResults.map((product, index) => (
                        <li key={product.id}>
                          <button
                            onClick={() => navigateToProduct(product.id)}
                            onMouseEnter={() => setSelectedResult(index)}
                            className={`w-full text-left flex items-center p-2 ${
                              selectedResult === index ? 'bg-primary-50' : 'hover:bg-gray-50'
                            } rounded-lg`}
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                              <p className="text-xs text-gray-500 truncate">{product.category}</p>
                              <div className="mt-1">
                                {product.discount > 0 ? (
                                  <div className="flex items-center">
                                    <span className="text-xs font-medium text-primary-600">
                                      {formatPrice(getDiscountedPrice(product.price, product.discount))}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through ml-1">
                                      {formatPrice(product.price)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs font-medium text-primary-600">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            )}

            {/* No Results */}
            {!isSearching && searchTerm.length > 2 && searchResults.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">No results found for "{searchTerm}"</p>
                <p className="text-xs text-gray-400">Try using different keywords or browse our categories</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedSearch
