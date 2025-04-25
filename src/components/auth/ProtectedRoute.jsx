import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * A component that protects routes by checking if the user has the required role
 * If not authenticated or doesn't have the required role, redirects to login
 */
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, isAdmin } = useAuthStore()
  const location = useLocation()
  
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // If admin role is required, check if user is admin
  if (requiredRole === 'admin' && !isAdmin()) {
    console.log('Access denied: User is not an admin')
    return <Navigate to="/" replace />
  }
  
  return element
}

export default ProtectedRoute