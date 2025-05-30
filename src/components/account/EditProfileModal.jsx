import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiUpload, FiSave } from 'react-icons/fi'

// Store
import useAuthStore from '../../store/authStore'

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [customImage, setCustomImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  
  // Initialize form with user data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      })
      setPreviewUrl(user.avatar || '')
    }
  }, [user, isOpen])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (png, jpg, jpeg)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      setCustomImage(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    try {
      // Check required fields
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required')
      }
      
      // If there's a custom image, convert it to base64
      if (customImage) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64Image = e.target.result
          await updateProfile({
            ...formData,
            avatar: base64Image
          })
          setIsSubmitting(false)
          onClose()
        }
        reader.readAsDataURL(customImage)
      } else {
        await updateProfile(formData)
        setIsSubmitting(false)
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile')
      setIsSubmitting(false)
      console.error('Failed to update profile:', err)
    }
  }
  
  // Demo avatars for selection
  const demoAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
  ]
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Avatar Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {demoAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                          formData.avatar === avatar ? 'border-primary-500 shadow-md scale-110' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, avatar }))
                          setPreviewUrl(avatar)
                          setCustomImage(null)
                        }}
                      >
                        <img 
                          src={avatar} 
                          alt={`Avatar option ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Image Upload */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Custom Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <img 
                          src={previewUrl || 'https://via.placeholder.com/150?text=Upload+Image'} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="custom-image-upload"
                        />
                        <label
                          htmlFor="custom-image-upload"
                          className="btn btn-outline flex items-center gap-2 cursor-pointer"
                        >
                          <FiUpload size={16} /> Choose Image
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Max size: 5MB. Supported formats: JPG, PNG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input pl-10"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
                
                {/* Email Field */}
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EditProfileModal
