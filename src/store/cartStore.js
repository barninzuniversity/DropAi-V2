import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { processProductPrices, calculateDiscountedPrice } from '../utils/priceFormatter'
import { validateStockAvailability, decrementStock } from '../utils/inventoryService'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCheckingOut: false,
      checkoutError: null,
      
      // Add an item to the cart - with proper price processing
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const itemIndex = items.findIndex(item => item.id === product.id)
        
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
          return
        }
        
        const updatedItems = items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
        
        set({ items: updatedItems })
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
      
      // Complete checkout process
      checkout: async (orderDetails, updateStockCallback, products) => {
        const { items } = get();
        set({ isCheckingOut: true, checkoutError: null });
        
        try {
          // First validate if all items are in stock
          const orderedItems = items.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }));
          
          const stockValidation = validateStockAvailability(orderedItems, products);
          
          if (!stockValidation.success) {
            set({ 
              isCheckingOut: false, 
              checkoutError: {
                message: 'Some items are out of stock',
                insufficientItems: stockValidation.insufficientItems
              }
            });
            return { success: false, error: 'Insufficient stock' };
          }
          
          // Process order - this would typically call your backend API
          // For demo purposes, simulate a successful order
          const orderResponse = { 
            success: true, 
            orderId: `ORD-${Date.now()}` 
          };
          
          if (orderResponse.success) {
            // Update inventory when order is successful
            await decrementStock(orderedItems, updateStockCallback);
            
            // Clear cart after successful order
            set({ items: [], isCheckingOut: false });
            return { success: true, orderId: orderResponse.orderId };
          } else {
            throw new Error('Order processing failed');
          }
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
