import { useEffect } from 'react'
import useInventoryStore from '../../store/inventoryStore'

// This component doesn't render anything, it just initializes and manages product inventory
const ProductInventoryManager = ({ products }) => {
  const { initializeProduct } = useInventoryStore()
  
  useEffect(() => {
    // Initialize inventory for all products
    if (products && products.length > 0) {
      products.forEach(product => {
        // If product has a stock property, use it, otherwise default to 10
        const stock = product.stock !== undefined ? product.stock : 10
        initializeProduct(product.id, stock)
      })
    }
  }, [products, initializeProduct])
  
  // This component doesn't render anything
  return null
}

export default ProductInventoryManager