import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiShoppingBag } from 'react-icons/fi'

const NotFoundPage = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container max-w-4xl mx-auto">
        <motion.div 
          className="text-center py-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-9xl font-bold gradient-text inline-block">404</div>
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="btn btn-primary flex items-center justify-center gap-2">
                <FiHome /> Back to Home
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="btn btn-outline flex items-center justify-center gap-2">
                <FiShoppingBag /> Browse Products
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Animated elements */}
          <div className="relative h-64 mt-16">
            <motion.div
              className="absolute left-1/4 top-0 w-16 h-16 bg-primary-100 rounded-lg"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute right-1/4 top-1/4 w-20 h-20 bg-secondary-100 rounded-full"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -15, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <motion.div
              className="absolute left-1/3 bottom-0 w-12 h-12 bg-accent-100 rounded-lg"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 20, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage