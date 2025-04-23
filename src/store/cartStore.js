import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { processProductPrices, calculateDiscountedPrice } from '../utils/priceFormatter'
import { validateStockAvailability, processOrder } from '../utils/inventoryService'
import useInventoryStore from './inventoryStore'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCheckingOut: false,
      checkoutError: null,
      isOpen: false,
      
      // Toggle cart open/closed
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      
      // Open cart
      openCart: () => set({ isOpen: true }),
      
      // Close cart
      closeCart: () => set({ isOpen: false }),
      
      // Add an item to the cart - with proper price processing and stock validation
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const itemIndex = items.findIndex(item => item.id === product.id)
        
        // Check if product is in stock before adding
        const inventoryStore = useInventoryStore.getState()
        if (!inventoryStore.isInStock(product.id, quantity)) {
          console.warn(`Product ${product.id} is out of stock or has insufficient quantity`)
          return false
        }
        
        // Process product prices to ensure consistent structure
        const processedProduct = processProductPrices(product);
        
        if (itemIndex !== -1) {
          // Item exists, update quantity
          const updatedItems = [...items]
          updatedItems[itemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          // New item, add to cart with processed prices
          set({
            items: [...items, { 
              ...processedProduct, 
              quantity,
              // Use price property for backward compatibility
              price: processedProduct.finalPrice 
            }]
          })
        }
        
        return true
      },
      // Remove an item from the cart
      removeItem: (productId) => {
        const { items } = get()
        set({
          items: items.filter(item => item.id !== productId)
        })
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        const { items } = get()
        
        if (quantity <= 0) {
          // Remove item if quantity becomes 0 or negative
          set({
            items: items.filter(item => item.id !== productId)
          })
          return false
        }
        
        // Check if we have enough stock for the new quantity
        const inventoryStore = useInventoryStore.getState()
        if (!inventoryStore.isInStock(productId, quantity)) {
          console.warn(`Cannot update quantity: Product ${productId} has insufficient stock`)
          return false
        }
        
        const updatedItems = items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
        
        set({ items: updatedItems })
        return true
      },
      
      // Update item discount
      updateDiscount: (productId, discountPercentage) => {
        const { items } = get()
        
        const updatedItems = items.map(item => {
          if (item.id === productId) {
            // Recalculate prices with new discount
            const finalPrice = calculateDiscountedPrice(item.originalPrice, discountPercentage);
            return { 
              ...item, 
              discountPercentage,
              hasDiscount: discountPercentage > 0,
              finalPrice,
              price: finalPrice // Keep price field updated for backward compatibility
            };
          }
          return item;
        });
        
        set({ items: updatedItems });
      },
      
      // Clear the cart
      clearCart: () => set({ items: [] }),
      // Get total number of items in cart
      getItemCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      
      // Get cart total price - uses finalPrice (or price as fallback)
      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          // Use finalPrice if available, otherwise fall back to price
          const itemPrice = item.finalPrice !== undefined ? item.finalPrice : item.price;
          return total + (itemPrice * item.quantity);
        }, 0);
      },
      
      // Get cart original total (before discounts)
      getCartOriginalTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const originalPrice = item.originalPrice || item.price;
          return total + (originalPrice * item.quantity);
        }, 0);
      },
      
      // Get total savings from discounts
      getCartSavings: () => {
        const { getCartOriginalTotal, getCartTotal } = get()
        return getCartOriginalTotal() - getCartTotal();
      },
      
      // Complete checkout process with inventory deduction
      checkout: async (orderDetails, refreshProductsCallback) => {
        const { items } = get();
        set({ isCheckingOut: true, checkoutError: null });
        
        try {
          // Format ordered items for inventory processing
          const orderedItems = items.map(item => ({
            id: item.id,
            quantity: item.quantity
          }));
          
          // Deduct from inventory using inventory store
          const inventoryStore = useInventoryStore.getState();
          const deductionResult = inventoryStore.bulkDeductFromStock(orderedItems);
          
          if (!deductionResult.success) {
            set({ 
              isCheckingOut: false, 
              checkoutError: {
                message: deductionResult.message || 'Failed to process order',
                insufficientItems: deductionResult.insufficientItems
              }
            });
            return { success: false, error: deductionResult.message };
          }
          
          // Order successful - refresh products in the UI
          if (refreshProductsCallback && typeof refreshProductsCallback === 'function') {
            refreshProductsCallback();
          }
          
          // Generate a dummy order ID for demonstration
          const orderId = `ORD-${Date.now()}`;
          
          // Clear cart after successful order
          set({ items: [], isCheckingOut: false });
          
          return { 
            success: true, 
            orderId,
            message: 'Order placed successfully'
          };
        } catch (error) {
          console.error('Checkout error:', error);
          set({ 
            isCheckingOut: false, 
            checkoutError: { message: error.message || 'Checkout failed' }
          });
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
)

export default useCartStore
