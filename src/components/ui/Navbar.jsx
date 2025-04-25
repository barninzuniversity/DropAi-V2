import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMenu, 
  FiX, 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiShield, 
  FiLogIn, 
  FiUserPlus,
  FiSettings
} from 'react-icons/fi'

// Auth Store
import useAuthStore from '../../store/authStore'
// Use Cart Context
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const location = useLocation()
  // Force a direct access to the store state to ensure we get the latest values
  const { user, isAuthenticated } = useAuthStore(state => ({ 
    user: state.user, 
    isAuthenticated: state.isAuthenticated 
  }))
  const isAdmin = useAuthStore(state => state.isAdmin())
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Debug auth state on render
  useEffect(() => {
    console.log('Navbar auth state:', { 
      user, 
      isAuthenticated, 
      isAdmin,
      email: user?.email 
    })
  }, [user, isAdmin, isAuthenticated])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    useAuthStore.getState().logout()
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold gradient-text">
          DropAI
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
          
          {/* Show Admin link only for admin users */}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`nav-link flex items-center ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <FiShield className="mr-1" /> Admin
            </Link>
          )}
        </nav>

        {/* User Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="btn-icon relative">
            <FiShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            /* Logged In State */
            <div className="relative group">
              <button className="btn-icon">
                <FiUser />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium">Signed in as</p>
                  <p className="text-sm text-gray-700 truncate">{user?.email || 'User'}</p>
                </div>
                
                <Link to="/account" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
                  <FiUser className="mr-2" /> My Account
                </Link>
                
                {/* Admin Dashboard Link - Only for admins */}
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
                    <FiShield className="mr-2" /> Admin Dashboard
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out State */
            <div className="flex space-x-2">
              <Link to="/login" className="btn btn-outline btn-sm flex items-center">
                <FiLogIn className="mr-1" /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm flex items-center">
                <FiUserPlus className="mr-1" /> Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden btn-icon"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container py-4 space-y-4">
              <Link 
                to="/" 
                className={`block py-2 ${location.pathname === '/' ? 'text-primary-600 font-medium' : 'text-gray-800'}`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`block py-2 ${location.pathname.startsWith('/products') ? 'text-primary-600 font-medium' : 'text-gray-800'}`}
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className={`block py-2 ${location.pathname === '/contact' ? 'text-primary-600 font-medium' : 'text-gray-800'}`}
              >
                Contact
              </Link>
              
              {/* Show Admin link only for admin users */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`block py-2 flex items-center ${location.pathname === '/admin' ? 'text-primary-600 font-medium' : 'text-gray-800'}`}
                >
                  <FiShield className="mr-2" /> Admin Dashboard
                </Link>
              )}
              
              <div className="border-t pt-4 flex flex-col space-y-3">
                <Link to="/cart" className="flex items-center justify-between text-gray-800 py-2">
                  <div className="flex items-center">
                    <FiShoppingCart className="mr-2" /> Cart
                  </div>
                  {itemCount > 0 && (
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
                
                {isAuthenticated ? (
                  /* Logged In Mobile Options */
                  <>
                    <Link to="/account" className="flex items-center text-gray-800 py-2">
                      <FiUser className="mr-2" /> My Account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center text-gray-800 py-2">
                        <FiShield className="mr-2" /> Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center text-gray-800 py-2"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  /* Logged Out Mobile Options */
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" className="btn btn-outline">
                      <FiLogIn className="mr-1" /> Login
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                      <FiUserPlus className="mr-1" /> Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Admin Shortcut Button - Only visible for admin users */}
      {isAdmin && isAuthenticated && (
        <motion.div 
          className="fixed bottom-8 right-8 z-40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/admin" 
            className="bg-primary-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
            title="Admin Dashboard"
          >
            <FiSettings className="text-xl" />
          </Link>
        </motion.div>
      )}
    </header>
  )
}

export default Navbar
