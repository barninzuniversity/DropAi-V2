import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * A component that protects routes by checking if the user has the required role
 * If not authenticated or doesn't have the required role, redirects to login
 */
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Add null check for user object
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" replace />
  }
  
  return element
}
export default ProtectedRoute