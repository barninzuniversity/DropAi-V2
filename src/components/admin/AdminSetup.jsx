import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiCheck } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'

const AdminSetup = () => {
  const [isSetup, setIsSetup] = useState(false)
  const { user, isAdmin } = useAuthStore()
  
  const setupAdmin = () => {
    // Get the current user from localStorage
    const storedUser = localStorage.getItem('auth-storage');
    
    if (storedUser) {
      try {
        // Parse the stored user data
        const userData = JSON.parse(storedUser);
        
        // Only allow admin@drop.ai to be admin
        if (userData.state.user.email !== 'admin@drop.ai') {
          console.log('Access denied: Only admin@drop.ai can be an admin');
          return;
        }
        
        // Update with admin privileges
        const adminUser = {
          ...userData,
          state: {
            ...userData.state,
            user: {
              ...userData.state.user,
              role: 'admin'
            }
          }
        };
        
        // Save back to localStorage
        localStorage.setItem('auth-storage', JSON.stringify(adminUser));
        
        setIsSetup(true)
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  }
  
  // Only show the setup button if user is logged in but not an admin
  if (!user || isAdmin()) {
    return null
  }
  
  // Only show the setup button for admin@drop.ai
  if (user.email !== 'admin@drop.ai') {
    return null
  }
  
  return (
    <div className="fixed bottom-8 right-8 z-40">
      {isSetup ? (
        <motion.div 
          className="bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FiCheck className="text-xl" />
        </motion.div>
      ) : (
        <motion.button 
          onClick={setupAdmin}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
          title="Setup Admin Account"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiShield className="text-xl" />
        </motion.button>
      )}
    </div>
  )
}

export default AdminSetup 