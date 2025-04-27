import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import useAuthStore from '../store/authStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore()

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    
    // Clear field-specific error when user types
    if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: '' }))
    }
    
    // Clear global error
    if (error) {
      clearError()
    }
  }
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    
    // Clear field-specific error when user types
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: '' }))
    }
    
    // Clear global error
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!password) {
      errors.password = 'Password is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const success = await login(email, password)
      if (success) {
        // Show success message
        toast.success('Login successful!')
        
        // Redirect admin to /admin, others to home or original page
        if (email.toLowerCase() === 'admin@drop.ai') {
          navigate('/admin', { replace: true })
        } else {
          navigate(from, { replace: true })
        }
      } else {
        toast.error('Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error(err.message || 'An error occurred during login')
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 mb-6"
            >
              <FiAlertCircle className="flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`input pl-10 w-full ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`input pl-10 w-full ${formErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
