import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      
      init: () => {
        const state = get()
        try {
          // Verify stored data integrity
          const storedData = localStorage.getItem('auth-storage')
          if (storedData) {
            const parsedData = JSON.parse(storedData)
            if (!parsedData.state || !parsedData.state.user) {
              // Invalid stored data, clear it
              localStorage.removeItem('auth-storage')
              set({ user: null, isAuthenticated: false, error: null })
            }
          }
        } catch (error) {
          console.error('Error initializing auth store:', error)
          // Clear potentially corrupted data
          localStorage.removeItem('auth-storage')
          set({ user: null, isAuthenticated: false, error: null })
        }
        // Only set loading to false if we haven't already loaded user data
        if (state.isLoading) {
          set({ isLoading: false })
        }
      },
      
      isAdmin: () => {
        const state = get()
        const user = state.user
        if (!user) return false
        return user.email === 'admin@drop.ai' && user.role === 'admin'
      },
      
      // Login user
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          // Clear any existing auth data
          localStorage.removeItem('auth-storage')
          
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // For demo purposes, we'll accept any email/password
          // with basic validation
          if (!email || !password) {
            throw new Error('Email and password are required')
          }
          
          // Check if this is the admin account
          const isAdminAccount = email.toLowerCase() === 'admin@drop.ai'
          console.log('Is admin account:', isAdminAccount, 'Email:', email)
          
          // Mock user data
          const userData = {
            id: '1',
            name: email.split('@')[0],
            email,
            role: isAdminAccount ? 'admin' : 'customer',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            orders: [],
            wishlist: [],
            preferences: {
              categories: [],
              priceRange: [0, 1000],
              brands: []
            }
          }
          
          console.log('Login successful:', userData)
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return true
        } catch (error) {
          console.error('Login error:', error)
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to login',
            isAuthenticated: false,
            user: null
          })
          return false
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
          const isAdminAccount = email.toLowerCase() === 'admin@drop.ai'
          console.log('Is admin account:', isAdminAccount, 'Email:', email)
          
          // Mock user data
          const userData = {
            id: '1',
            name,
            email,
            role: isAdminAccount ? 'admin' : 'customer',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            // Add default empty arrays for orders and wishlist
            orders: [],
            wishlist: [],
            // Add default preferences
            preferences: {
              categories: [],
              priceRange: [0, 1000],
              brands: []
            }
          }
          
          // Log the user data for debugging
          console.log('Registration successful:', userData)
          
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
            error: error.message || 'Failed to register',
            isAuthenticated: false,
            user: null
          })
          throw error
        }
      },
      
      // Logout user
      logout: () => {
        console.log('Logging out user')
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
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const currentUser = get().user
          if (!currentUser) {
            throw new Error('No user logged in')
          }
          
          const updatedUser = { 
            ...currentUser, 
            ...userData,
            // Preserve arrays and objects if not provided in update
            orders: userData.orders || currentUser.orders || [],
            wishlist: userData.wishlist || currentUser.wishlist || [],
            preferences: {
              ...currentUser.preferences,
              ...(userData.preferences || {})
            }
          }
          
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
      onRehydrateStorage: () => (state) => {
        // When the store is rehydrated from storage, initialize it
        if (state) {
          state.init()
        }
      }
    }
  )
)

export default useAuthStore
