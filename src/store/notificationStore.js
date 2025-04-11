import { create } from 'zustand'

/**
 * Store for managing notification state across the application
 * Uses Zustand for state management
 */
const useNotificationStore = create((set) => ({
  // Notification state
  notification: {
    isVisible: false,
    type: 'info',
    message: '',
    autoCloseTime: 5000,
    position: 'top',
    showIcon: true
  },
  
  /**
   * Show a notification with the given parameters
   * 
   * @param {Object} params - Notification parameters
   * @param {string} params.type - Type of notification: 'success', 'error', 'info', 'warning'
   * @param {string} params.message - The message to display
   * @param {number} params.autoCloseTime - Time in ms before auto-closing (0 to disable)
   * @param {string} params.position - Position of the notification: 'top', 'bottom'
   * @param {boolean} params.showIcon - Whether to show the icon
   */
  showNotification: (params) => {
    set({
      notification: {
        isVisible: true,
        type: params.type || 'info',
        message: params.message || '',
        autoCloseTime: params.autoCloseTime !== undefined ? params.autoCloseTime : 5000,
        position: params.position || 'top',
        showIcon: params.showIcon !== undefined ? params.showIcon : true
      }
    })
  },
  
  /**
   * Hide the current notification
   */
  hideNotification: () => {
    set((state) => ({
      notification: {
        ...state.notification,
        isVisible: false
      }
    }))
  },
  
  /**
   * Show a success notification
   * 
   * @param {string} message - The message to display
   * @param {Object} options - Additional options
   */
  showSuccess: (message, options = {}) => {
    set({
      notification: {
        isVisible: true,
        type: 'success',
        message,
        autoCloseTime: options.autoCloseTime !== undefined ? options.autoCloseTime : 5000,
        position: options.position || 'top',
        showIcon: options.showIcon !== undefined ? options.showIcon : true
      }
    })
  },
  
  /**
   * Show an error notification
   * 
   * @param {string} message - The message to display
   * @param {Object} options - Additional options
   */
  showError: (message, options = {}) => {
    set({
      notification: {
        isVisible: true,
        type: 'error',
        message,
        autoCloseTime: options.autoCloseTime !== undefined ? options.autoCloseTime : 5000,
        position: options.position || 'top',
        showIcon: options.showIcon !== undefined ? options.showIcon : true
      }
    })
  },
  
  /**
   * Show an info notification
   * 
   * @param {string} message - The message to display
   * @param {Object} options - Additional options
   */
  showInfo: (message, options = {}) => {
    set({
      notification: {
        isVisible: true,
        type: 'info',
        message,
        autoCloseTime: options.autoCloseTime !== undefined ? options.autoCloseTime : 5000,
        position: options.position || 'top',
        showIcon: options.showIcon !== undefined ? options.showIcon : true
      }
    })
  },
  
  /**
   * Show a warning notification
   * 
   * @param {string} message - The message to display
   * @param {Object} options - Additional options
   */
  showWarning: (message, options = {}) => {
    set({
      notification: {
        isVisible: true,
        type: 'warning',
        message,
        autoCloseTime: options.autoCloseTime !== undefined ? options.autoCloseTime : 5000,
        position: options.position || 'top',
        showIcon: options.showIcon !== undefined ? options.showIcon : true
      }
    })
  }
}))

export default useNotificationStore