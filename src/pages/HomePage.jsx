import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiShoppingCart, FiStar, FiTrendingUp, FiPackage, FiHeadphones } from 'react-icons/fi'

// Data
import { featuredProducts } from '../data/products'

// Components
import ProductCard from '../components/products/ProductCard'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  
  // Refs for scroll animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [productsRef, productsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true })
  
  useEffect(() => {
    // In a real app, this would be an API call
    setProducts(featuredProducts.slice(0, 4))
  }, [])

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100))
  }

  const features = [
    {
      icon: <FiTrendingUp className="text-3xl text-primary-500" />,
      title: 'AI-Powered Recommendations',
      description: 'Our smart algorithm learns your preferences to suggest products you\'ll love.'
    },
    {
      icon: <FiPackage className="text-3xl text-primary-500" />,
      title: 'Fast Global Shipping',
      description: 'Products shipped directly to your door from our global network of suppliers.'
    },
    {
      icon: <FiHeadphones className="text-3xl text-primary-500" />,
      title: '24/7 Customer Support',
      description: 'Our dedicated team is always ready to help with any questions or concerns.'
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-50" />
        
        <motion.div 
          className="absolute top-20 right-0 w-96 h-96 bg-accent-300 rounded-full filter blur-3xl opacity-20"
          style={{ y: y1, x: 50 }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-primary-300 rounded-full filter blur-3xl opacity-20"
          style={{ y: y2, x: -20 }}
        />
        
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">AI-Powered</span> Shopping Experience
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover products tailored just for you. Our AI technology finds the perfect items based on your preferences and style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/products" className="btn btn-primary px-8 py-4">
                    Shop Now <FiShoppingCart className="ml-2" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/about" className="btn btn-outline px-8 py-4">
                    Learn More <FiArrowRight className="ml-2" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.img 
                  src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  alt="AI Shopping Experience"
                  className="rounded-lg shadow-2xl z-10 relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-24 h-24 bg-accent-100 rounded-lg z-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-100 rounded-full z-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DropAI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with a curated selection of premium products to create a unique shopping experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            ref={productsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of trending products, curated just for you.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={productsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link 
                      to={`/products/${product.id}`}
                      className="bg-white text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-300 font-medium px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-5">
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
                  <h3 className="text-lg font-bold mb-1 text-gray-800">{product.name}</h3>
                  <div className="flex items-center">
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
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link 
              to="/products"
              className="btn btn-outline inline-flex items-center"
            >
              View All Products <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shopping Experience?</h2>
            <p className="text-lg mb-8 text-white text-opacity-90">
              Join thousands of satisfied customers who have discovered their perfect products through our AI-powered platform.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
                Start Shopping Now <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage