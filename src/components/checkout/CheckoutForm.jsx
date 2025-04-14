// Example of a checkout form submission function - adjust to match your actual implementation
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext' // Adjust import path as needed

// Inside your checkout component:
const CheckoutForm = () => {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  
  // Your existing form state and handlers...
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Process payment and create order
      // Your existing API calls here...
      
      // Clear the cart
      clearCart()
      
      // Redirect to confirmation page instead of showing "Cart is empty"
      navigate('/purchase-confirmation')
    } catch (error) {
      console.error('Checkout error:', error)
      // Handle error state
    }
  }
  
  // Rest of your component...
}

export default CheckoutForm