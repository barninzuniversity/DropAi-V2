import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiLogIn, 
  FiLogOut,
  FiUserPlus, 
  FiShield,
  FiSettings
} from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'

// Components
import EnhancedSearch from '../search/EnhancedSearch'

const Header = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
  const cartItems = useCartStore(state => state.items)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const isAdminUser = isAdmin()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debug auth state on render
  useEffect(() => {
    console.log('Header auth state:', { 
      user, 
      isAuthenticated, 
      isAdminUser,
      email: user?.email,
      role: user?.role
    })
  }, [user, isAdminUser, isAuthenticated])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Navigation links including conditional admin link
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    ...(isAdminUser ? [{ to: '/admin', label: 'Admin', icon: <FiShield /> }] : [])
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            DropAi
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
              >
                {link.icon && <span className="mr-1">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                to="/cart" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="text-xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdminUser && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/admin" 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 text-primary-600"
                      aria-label="Admin Dashboard"
                    >
                      <FiShield className="text-xl" />
                    </Link>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/profile" 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                    aria-label="My Account"
                  >
                    <FiUser className="text-xl" />
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  aria-label="Logout"
                >
                  <FiLogOut className="text-xl" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className="flex items-center gap-1 px-3 py-2 rounded-md bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors duration-300"
                  >
                    <FiLogIn className="text-sm" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/register" 
                    className="flex items-center gap-1 px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-300"
                  >
                    <FiUserPlus className="text-sm" />
                    <span className="text-sm font-medium">Register</span>
                  </Link>
                </motion.div>
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
              className="md:hidden bg-white border-t mt-4"
            >
              <nav className="py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Menu User Section */}
                <div className="mt-4 pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-300"
                      >
                        <FiUser className="inline-block mr-2" /> My Account
                      </Link>
                      {isAdminUser && (
                        <Link 
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-300"
                        >
                          <FiShield className="inline-block mr-2" /> Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-300"
                      >
                        <FiLogOut className="inline-block mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-300"
                      >
                        <FiLogIn className="inline-block mr-2" /> Login
                      </Link>
                      <Link 
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-300"
                      >
                        <FiUserPlus className="inline-block mr-2" /> Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header