import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiUser } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const { items } = useCartStore()

  // ... existing code ...
} 