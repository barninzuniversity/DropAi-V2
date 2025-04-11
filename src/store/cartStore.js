import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          const updatedItems = items.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          set({ items: updatedItems })
        } else {
          // Add new item
          set({ items: [...items, { ...product, quantity }] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        const updatedItems = get().items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
        set({ items: updatedItems })
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        )
      },
      getItemsCount: () => {
        return get().items.reduce(
          (count, item) => count + item.quantity, 
          0
        )
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
)

export default useCartStore