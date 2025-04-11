import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogIn, FiUserPlus } from 'react-icons/fi'

// Components
import EnhancedSearch from '../search/EnhancedSearch'

// Store
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

const Header = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { items } = useCartStore()
  const { isAuthenticated, user, isAdmin } = useAuthStore()
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  // Filter admin link based on user role
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    ...(isAdmin() ? [{ name: 'Admin', path: '/admin' }] : []),
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold font-heading gradient-text">DropAI</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((link, index) => (
              <motion.li 
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink 
                  to={link.path}
                  className={({ isActive }) => 
                    `text-base font-medium relative transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.span 
                          layoutId="underline"
                          className="absolute left-0 top-full h-0.5 w-full bg-primary-600"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-3">
          {/* Search Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSearch}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            aria-label="Search"
          >
            <FiSearch className="text-xl" />
          </motion.button>

          {/* User Account or Auth Links */}
          {isAuthenticated ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/account" 
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                aria-label="Account"
              >
                {user?.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <img 
                      src={user.avatar} 
                      alt={user.name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <FiUser className="text-xl" />
                )}
                <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            </motion.div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
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

          {/* Login Icon for Mobile when not authenticated */}
          {!isAuthenticated && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
            >
              <Link 
                to="/login" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                aria-label="Login"
              >
                <FiLogIn className="text-xl" />
              </Link>
            </motion.div>
          )}

          {/* Shopping Cart */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-xl" />
              {items.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {items.length}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="p-2 md:hidden menu-button rounded-full hover:bg-gray-100 transition-colors duration-300"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </motion.button>
        </div>
      </div>

      {/* AI-Enhanced Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-white shadow-md p-4 z-50"
          >
            <div className="container">
              <div className="relative">
                <EnhancedSearch />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
                  onClick={toggleSearch}
                >
                  <FiX />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white z-50 mobile-menu md:hidden pt-20"
          >
            <div className="container h-full flex flex-col">
              <nav className="py-5">
                <ul className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <NavLink 
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => 
                          `text-2xl font-medium block transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-800 hover:text-primary-600'}`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-auto pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  {isAuthenticated ? (
                    <Link 
                      to="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-outline w-full flex items-center justify-center gap-2"
                    >
                      <FiUser />
                      <span>My Account</span>
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-outline w-full flex items-center justify-center gap-2"
                      >
                        <FiLogIn />
                        <span>Login</span>
                      </Link>
                      <Link 
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <FiUserPlus />
                        <span>Register</span>
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className={`btn ${isAuthenticated ? 'btn-primary' : 'btn-outline'} w-full flex items-center justify-center gap-2`}
                  >
                    <FiShoppingCart />
                    <span>View Cart {items.length > 0 && `(${items.length})`}</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header