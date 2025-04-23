
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useInventoryStore = create(
  persist(
    (set, get) => ({
      // All products with their inventory information
      products: {},
      
      // Initialize product inventory
      initializeProduct: (productId, stock) => {
        if (!productId) {
          console.error('Cannot initialize product: Invalid product ID')
          return false
        }
        
        // Convert productId to string to ensure consistent keys
        const id = String(productId)
        
        set((state) => ({
          products: {
            ...state.products,
            [id]: state.products[id] 
              ? state.products[id] 
              : { stock: stock || 0 }
          }
        }))
        console.log(`Initialized product ${id} with stock ${stock || 0}`)
        return true
      },
      
      // Set stock for a product
      setStock: (productId, stock) => {
        if (!productId) {
          console.error('Cannot set stock: Invalid product ID')
          return false
        }
        
        if (typeof stock !== 'number' || stock < 0) {
          console.error(`Cannot set invalid stock value: ${stock}`)
          return false
        }
        
        // Convert productId to string to ensure consistent keys
        const id = String(productId)
        
        set((state) => ({
          products: {
            ...state.products,
            [id]: {
              ...state.products[id],
              stock
            }
          }
        }))
        console.log(`Set stock for product ${id} to ${stock}`)
        return true
      },
      
      // Check if product is in stock
      isInStock: (productId, quantity = 1) => {
        if (!productId) return false
        
        // Convert productId to string to ensure consistent keys
        const id = String(productId)
        
        const product = get().products[id]
        if (!product) {
          console.warn(`Product ${id} not found in inventory`)
          return false
        }
        
        return product.stock >= quantity
      },
      
      // Get product stock
      getStock: (productId) => {
        if (!productId) return 0
        
        // Convert productId to string to ensure consistent keys
        const id = String(productId)
        
        const product = get().products[id]
        if (!product) {
          console.warn(`Product ${id} not found in inventory`)
          return 0
        }
        
        return product.stock
      },
      
      // Deduct from stock (for individual product purchase)
      deductFromStock: (productId, quantity = 1) => {
        if (!productId) {
          console.error('Cannot deduct stock: Invalid product ID')
          return false
        }
        
        if (typeof quantity !== 'number' || quantity <= 0) {
          console.error(`Cannot deduct invalid quantity: ${quantity}`)
          return false
        }
        
        // Convert productId to string to ensure consistent keys
        const id = String(productId)
        
        const currentStock = get().getStock(id)
        
        if (currentStock < quantity) {
          console.error(`Not enough stock for product ${id}: requested ${quantity}, available ${currentStock}`)
          return false
        }
        
        set((state) => ({
          products: {
            ...state.products,
            [id]: {
              ...state.products[id],
              stock: currentStock - quantity
            }
          }
        }))
        
        console.log(`Deducted ${quantity} from stock for product ${id}. New stock: ${currentStock - quantity}`)
        return true
      },
      
      // Add to stock (for returns or restocking)
      addToStock: (productId, quantity = 1) => {
        if (!productId) {
          console.error('Cannot add stock: Invalid product ID')
          return false
        }
        
        if (typeof quantity !== 'number' || quantity <= 0) {
          console.error(`Cannot add invalid quantity: ${quantity}`)
          return false
        }
        
        // Convert productId to string to ensure consistent keys
        const id = String(productId)
        
        const currentStock = get().getStock(id)
        
        set((state) => ({
          products: {
            ...state.products,
            [id]: {
              ...state.products[id],
              stock: currentStock + quantity
            }
          }
        }))
        
        console.log(`Added ${quantity} to stock for product ${id}. New stock: ${currentStock + quantity}`)
        return true
      },
      
      // Process a purchase - deduct quantities for purchased products
      processPurchase: (items) => {
        if (!Array.isArray(items) || items.length === 0) {
          console.error('Cannot process purchase: No items provided')
          return { success: false, message: 'No items to purchase' }
        }
        
        // Validate all items first
        const invalidItems = items.filter(item => 
          !item.id || typeof item.quantity !== 'number' || item.quantity <= 0
        )
        
        if (invalidItems.length > 0) {
          console.error('Cannot process purchase: Invalid items', invalidItems)
          return { 
            success: false, 
            message: 'Some items are invalid',
            invalidItems
          }
        }
        
        // Check if all items are in stock
        const outOfStockItems = items.filter(item => 
          !get().isInStock(item.id, item.quantity)
        )
        
        if (outOfStockItems.length > 0) {
          console.error('Cannot process purchase: Some items are out of stock', outOfStockItems)
          return { 
            success: false, 
            message: 'Some items are out of stock',
            outOfStockItems
          }
        }
        
        // Process the purchase by deducting all items
        items.forEach(item => {
          get().deductFromStock(item.id, item.quantity)
        })
        
        console.log('Purchase processed successfully', items)
        return { 
          success: true, 
          message: 'Purchase completed successfully' 
        }
      },
      
      // Bulk deduct from stock (for cart checkouts)
      bulkDeductFromStock: (items) => {
        // First check if all items can be deducted
        const canDeduct = items.every(item => 
          get().isInStock(item.id, item.quantity)
        )
        
        if (!canDeduct) {
          const outOfStockItems = items.filter(item => 
            !get().isInStock(item.id, item.quantity)
          )
          console.error('Cannot process bulk deduction: Some items are out of stock', outOfStockItems)
          return false
        }
        
        // Then deduct all items
        items.forEach(item => {
          get().deductFromStock(item.id, item.quantity)
        })
        
        console.log('Bulk deduction processed successfully', items)
        return true
      }
    }),
    {
      name: 'inventory-storage',
    }
  )
)

export default useInventoryStore
