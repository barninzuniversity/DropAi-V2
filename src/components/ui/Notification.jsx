import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'

/**
 * Notification component for displaying alerts, messages, and notifications
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of notification: 'success', 'error', 'info', 'warning'
 * @param {string} props.message - The message to display
 * @param {boolean} props.isVisible - Whether the notification is visible
 * @param {function} props.onClose - Function to call when notification is closed
 * @param {number} props.autoCloseTime - Time in ms before auto-closing (0 to disable)
 * @param {string} props.position - Position of the notification: 'top', 'bottom'
 * @param {boolean} props.showIcon - Whether to show the icon
 */
const Notification = ({
  type = 'info',
  message,
  isVisible = false,
  onClose,
  autoCloseTime = 5000,
  position = 'top',
  showIcon = true
}) => {
  const [visible, setVisible] = useState(isVisible)

  useEffect(() => {
    setVisible(isVisible)
  }, [isVisible])

  useEffect(() => {
    let timer
    if (visible && autoCloseTime > 0) {
      timer = setTimeout(() => {
        handleClose()
      }, autoCloseTime)
    }
    return () => clearTimeout(timer)
  }, [visible, autoCloseTime])

  const handleClose = () => {
    setVisible(false)
    if (onClose) {
      setTimeout(() => {
        onClose()
      }, 300) // Wait for exit animation to complete
    }
  }

  // Define styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          textColor: 'text-green-700',
          icon: <FiCheckCircle className="text-green-500 text-xl" />
        }
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-700',
          icon: <FiAlertCircle className="text-red-500 text-xl" />
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-700',
          icon: <FiAlertCircle className="text-yellow-500 text-xl" />
        }
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-700',
          icon: <FiInfo className="text-blue-500 text-xl" />
        }
    }
  }

  const styles = getTypeStyles()
  const positionClass = position === 'bottom' ? 'bottom-4' : 'top-4'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed ${positionClass} left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4`}
          initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className={`flex items-center justify-between p-4 rounded-lg shadow-md border ${styles.bgColor} ${styles.borderColor}`}
          >
            <div className="flex items-center space-x-3">
              {showIcon && styles.icon}
              <span className={`${styles.textColor} font-medium`}>{message}</span>
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close notification"
            >
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Notification