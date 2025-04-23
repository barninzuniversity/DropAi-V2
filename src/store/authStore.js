import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Check if current user is admin
      isAdmin: () => {
        const user = get().user
        return user && user.role === 'admin'
      },
      
      // Login user
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // For demo purposes, we'll accept any email/password
          // with basic validation
          if (!email || !password) {
            throw new Error('Email and password are required')
          }
          
          // Check if this is the admin account
          const isAdminAccount = email.toLowerCase() === 'admin@dropai.com'
          
          // Mock user data
          const userData = {
            id: '1',
            name: email.split('@')[0],
            email,
            role: isAdminAccount ? 'admin' : 'customer',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          }
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return userData
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to login' 
          })
          throw error
        }
      },
      
      // Register new user
      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Basic validation
          if (!name || !email || !password) {
            throw new Error('All fields are required')
          }
          
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters')
          }
          
          // Check if this is the admin account
          const isAdminAccount = email.toLowerCase() === 'admin@dropai.com'
          
          // Mock user data
          const userData = {
            id: '1',
            name,
            email,
            role: isAdminAccount ? 'admin' : 'customer',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          }
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return userData
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to register' 
          })
          throw error
        }
      },
      
      // Logout user
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false,
          error: null
        })
      },
      
      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const currentUser = get().user
          const updatedUser = { ...currentUser, ...userData }
          
          // Validate critical fields
          if (userData.email && !userData.email.includes('@')) {
            throw new Error('Please provide a valid email address')
          }
          
          set({ 
            user: updatedUser,
            isLoading: false,
            error: null
          })
          
          return updatedUser
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update profile' 
          })
          throw error
        }
      },
      
      // Update specific user field
      updateUserField: async (field, value) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const currentUser = get().user
          
          // Field-specific validations
          if (field === 'email' && !value.includes('@')) {
            throw new Error('Please provide a valid email address')
          }
          
          if (field === 'name' && value.trim() === '') {
            throw new Error('Name cannot be empty')
          }
          
          const updatedUser = { 
            ...currentUser, 
            [field]: value 
          }
          
          set({ 
            user: updatedUser,
            isLoading: false,
            error: null
          })
          
          return updatedUser
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || `Failed to update ${field}` 
          })
          throw error
        }
      },
      
      // Clear any errors
      clearError: () => set({ error: null }),
      
      // Reset loading state
      resetLoadingState: () => set({ isLoading: false }),
      
      // Check if user profile is complete
      isProfileComplete: () => {
        const user = get().user
        return user && user.name && user.email && user.avatar
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage
    }
  )
)

export default useAuthStore
