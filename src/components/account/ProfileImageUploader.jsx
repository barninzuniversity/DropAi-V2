import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiUpload, FiX } from 'react-icons/fi'

const ProfileImageUploader = ({ currentImage, onImageChange }) => {
  const [previewImage, setPreviewImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      validateAndProcessImage(file)
    }
  }
  
  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessImage(e.dataTransfer.files[0])
    }
  }
  
  // Validate and process the image
  const validateAndProcessImage = (file) => {
    setError(null)
    
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (png, jpg, jpeg)')
      return
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
    }
    reader.readAsDataURL(file)
    
    // Pass the file to parent component
    onImageChange(file)
  }
  
  // Clear preview and reset
  const handleClearPreview = () => {
    setPreviewImage(null)
    onImageChange(null)
  }
  
  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center">
        <div className="relative">
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md"
          >
            <img 
              src={previewImage || currentImage || 'https://via.placeholder.com/200?text=Upload+Image'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <label 
            htmlFor="profile-image-upload"
            className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors cursor-pointer"
          >
            <FiCamera size={16} />
            <input 
              type="file" 
              id="profile-image-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      {/* Drag and drop area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2">Image ready to upload</p>
            <button 
              onClick={handleClearPreview}
              className="text-red-500 text-sm flex items-center"
            >
              <FiX size={14} className="mr-1" /> Remove
            </button>
          </div>
        ) : (
          <div className="py-4">
            <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">Drag and drop an image here or</p>
            <label className="mt-2 inline-block">
              <span className="btn btn-sm btn-outline cursor-pointer">
                Browse Files
              </span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Supported formats: JPG, PNG. Max size: 5MB
      </p>
    </div>
  )
}

export default ProfileImageUploader