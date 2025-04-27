import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { processProductPrices, calculateDiscountedPrice } from '../utils/priceFormatter';
import useInventoryStore from './inventoryStore';

/**
 * Cart store to manage shopping cart state
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart state
      items: [],
      totalItems: 0,
      subtotal: 0,
      isCheckingOut: false,
      checkoutError: null,
      isOpen: false,
      
      // UI state management
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      // Add an item to the cart
      addItem: (product, quantity = 1) => {
        if (!product || !product.id) {
          console.error('Invalid product data:', product);
          return false;
        }
        
        // Check if product is in stock before adding
        const inventoryStore = useInventoryStore.getState();
        if (!inventoryStore.isInStock(product.id, quantity)) {
          console.warn(`Product ${product.id} is out of stock or has insufficient quantity`);
          return false;
        }
        
        // Process product prices to ensure consistent structure
        const processedProduct = processProductPrices(product);
        
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(item => item.id === product.id);
          
          let newItems;
          
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity
            };
          } else {
            // Add new item with processed prices
            newItems = [
              ...state.items,
              {
                ...processedProduct,
                quantity,
                // Use price property for backward compatibility
                price: processedProduct.finalPrice
              }
            ];
          }
          
          // Calculate new totals
          const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const newSubtotal = newItems.reduce((sum, item) => {
            const itemPrice = item.finalPrice !== undefined ? item.finalPrice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          return {
            items: newItems,
            totalItems: newTotalItems,
            subtotal: newSubtotal
          };
        });
        
        return true;
      },
      
      // Remove an item from the cart
      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== productId);
          const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const newSubtotal = newItems.reduce((sum, item) => {
            const itemPrice = item.finalPrice !== undefined ? item.finalPrice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          return {
            items: newItems,
            totalItems: newTotalItems,
            subtotal: newSubtotal
          };
        });
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return false;
        }
        
        // Check if we have enough stock for the new quantity
        const inventoryStore = useInventoryStore.getState();
        if (!inventoryStore.isInStock(productId, quantity)) {
          console.warn(`Cannot update quantity: Product ${productId} has insufficient stock`);
          return false;
        }
        
        set((state) => {
          const newItems = state.items.map(item => 
            item.id === productId ? { ...item, quantity } : item
          );
          
          const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const newSubtotal = newItems.reduce((sum, item) => {
            const itemPrice = item.finalPrice !== undefined ? item.finalPrice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          return {
            items: newItems,
            totalItems: newTotalItems,
            subtotal: newSubtotal
          };
        });
        
        return true;
      },
      
      // Update item discount
      updateDiscount: (productId, discountPercentage) => {
        set((state) => {
          const updatedItems = state.items.map(item => {
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
          
          // Recalculate totals
          const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const newSubtotal = updatedItems.reduce((sum, item) => {
            const itemPrice = item.finalPrice !== undefined ? item.finalPrice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          return {
            items: updatedItems,
            totalItems: newTotalItems,
            subtotal: newSubtotal
          };
        });
      },
      
      // Clear the cart
      clearCart: () => set({ 
        items: [], 
        totalItems: 0, 
        subtotal: 0 
      }),
      
      // Get item by id
      getItem: (productId) => {
        return get().items.find(item => item.id === productId);
      },
      
      // Get total number of items in cart (already tracked in totalItems)
      getItemCount: () => get().totalItems,
      
      // Get cart total price (already tracked in subtotal)
      getCartTotal: () => get().subtotal,
      
      // Get cart original total (before discounts)
      getCartOriginalTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const originalPrice = item.originalPrice || item.price;
          return total + (originalPrice * item.quantity);
        }, 0);
      },
      
      // Get total savings from discounts
      getCartSavings: () => {
        const { getCartOriginalTotal, subtotal } = get();
        return getCartOriginalTotal() - subtotal;
      },
      
      // Complete checkout process with inventory deduction
      checkout: async (orderDetails, refreshProductsCallback) => {
        const { items } = get();
        set({ isCheckingOut: true, checkoutError: null });
        
        try {
          console.log('Starting checkout process with items:', items);
          
          // Format ordered items for inventory processing
          const orderedItems = items.map(item => ({
            id: item.id,
            quantity: item.quantity
          }));
          
          // Deduct from inventory using inventory store
          const inventoryStore = useInventoryStore.getState();
          const deductionResult = inventoryStore.bulkDeductFromStock(orderedItems);
          
          if (!deductionResult.success) {
            console.error('Inventory deduction failed:', deductionResult);
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
          set({ 
            items: [], 
            totalItems: 0,
            subtotal: 0,
            isCheckingOut: false 
          });
          
          console.log('Checkout completed successfully with order ID:', orderId);
          
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
      getStorage: () => localStorage, // explicitly use localStorage
    }
  )
);

export default useCartStore;
