import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

// Create the cart context
const CartContext = createContext(null);

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array with validation
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      
      if (!savedCart) {
        console.log('No cart found in localStorage, initializing empty cart');
        return [];
      }
      
      const parsedCart = JSON.parse(savedCart);
      
      // Validate cart structure
      if (!Array.isArray(parsedCart)) {
        console.error('Cart is not an array, initializing empty cart');
        localStorage.removeItem('cart');
        return [];
      }
      
      // Filter out invalid items
      const validCart = parsedCart.filter(item => {
        const isValid = item && 
                       typeof item === 'object' && 
                       item.id !== undefined &&
                       typeof item.quantity === 'number' &&
                       item.quantity > 0;
        
        if (!isValid) {
          console.warn('Removed invalid item from cart:', item);
        }
        
        return isValid;
      });
      
      console.log('Cart initialized with', validCart.length, 'items');
      return validCart;
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      localStorage.removeItem('cart');
      return [];
    }
  });
  
  const [loading, setLoading] = useState(false);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      console.log('Cart saved with', items.length, 'items');
      
      // Debug log the cart count calculation
      const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
      console.log('Total item count:', count);
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);
  
  // Add an item to the cart
  const addItem = (product, quantity = 1) => {
    if (!product) {
      console.error("Cannot add undefined or null product to cart");
      return;
    }
    
    if (!product.id) {
      console.error("Product missing ID:", product);
      return;
    }
    
    // Validate quantity
    const validQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    
    // Ensure we have a valid ID
    const productId = String(product.id);
    
    setItems(currentItems => {
      // Check if the item is already in the cart
      const existingItemIndex = currentItems.findIndex(item => String(item.id) === productId);
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...currentItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + validQuantity;
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        
        toast.success(`Updated ${product.name} quantity in cart`);
        console.log(`Updated quantity for ${product.name} to ${newQuantity}`);
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        const newItem = { 
          ...product, 
          quantity: validQuantity
        };
        
        toast.success(`Added ${product.name} to cart`);
        console.log(`Added ${product.name} to cart with quantity ${validQuantity}`);
        return [...currentItems, newItem];
      }
    });
  };
  
  // Remove an item from the cart
  const removeItem = (productId) => {
    if (!productId) {
      console.error("Cannot remove item: missing product ID");
      return;
    }
    
    // Convert ID to string for consistent comparison
    const idStr = String(productId);
    
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => String(item.id) === idStr);
      
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
        console.log(`Removed ${itemToRemove.name} from cart`);
      } else {
        console.warn(`Item with ID ${productId} not found in cart`);
      }
      
      return currentItems.filter(item => String(item.id) !== idStr);
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (!productId) {
      console.error("Cannot update quantity: missing product ID");
      return;
    }
    
    // Convert quantity to number and validate
    const newQuantity = parseInt(quantity, 10);
    
    if (isNaN(newQuantity)) {
      console.error("Cannot update quantity: invalid quantity value", quantity);
      return;
    }
    
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    // Convert ID to string for consistent comparison
    const idStr = String(productId);
    
    setItems(currentItems => {
      const existingItem = currentItems.find(item => String(item.id) === idStr);
      
      if (!existingItem) {
        console.warn(`Item with ID ${productId} not found in cart`);
        return currentItems;
      }
      
      console.log(`Updated quantity for ${existingItem.name} from ${existingItem.quantity} to ${newQuantity}`);
      
      return currentItems.map(item => 
        String(item.id) === idStr ? { ...item, quantity: newQuantity } : item
      );
    });
  };
  
  // Clear the cart
  const clearCart = () => {
    setItems([]);
    console.log('Cart cleared');
    toast.success('Cart cleared');
  };
  
  // Calculate total price with robust error handling
  const calculateTotal = () => {
    // Safety check for empty cart
    if (!items || items.length === 0) return 0;
    
    try {
      return items.reduce((total, item) => {
        // Skip invalid items
        if (!item || typeof item !== 'object') return total;
        
        // Get base price, default to 0 if missing
        let itemPrice = typeof item.price === 'number' ? item.price : 0;
        
        // Calculate discounted price if applicable
        if (item.discount && typeof item.discount === 'number' && item.discount > 0) {
          itemPrice = itemPrice * (1 - (item.discount / 100));
        }
        
        // Use discountedPrice if available
        if (item.discountedPrice && typeof item.discountedPrice === 'number') {
          itemPrice = item.discountedPrice;
        }
        
        // Get quantity, default to 1 if missing
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        
        return total + (itemPrice * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  };
  
  // Calculate total number of items with robust error handling
  const calculateItemCount = () => {
    // CRITICAL FIX: Explicitly handle empty cart
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Cart is empty or invalid, returning count 0');
      return 0;
    }
    
    try {
      const count = items.reduce((total, item) => {
        // Skip invalid items
        if (!item || typeof item !== 'object') return total;
        
        // Get quantity, default to 0 if invalid
        const quantity = typeof item.quantity === 'number' && item.quantity > 0 
          ? item.quantity 
          : 0;
          
        return total + quantity;
      }, 0);
      
      console.log('Calculated item count:', count);
      return count;
    } catch (error) {
      console.error('Error calculating cart item count:', error);
      return 0;
    }
  };
  
  // Get cart status with explicit calculation
  const isEmpty = !items || items.length === 0;
  const itemCount = calculateItemCount();
  const total = calculateTotal();
  
  // Log cart state for debugging
  useEffect(() => {
    console.log('Cart state updated:', {
      itemsCount: items.length,
      isEmpty,
      itemCount,
      total,
      isItemCountZero: itemCount === 0
    });
  }, [items, isEmpty, itemCount, total]);
  
  const cartValues = {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    total,
    isEmpty
  };
  
  return (
    <CartContext.Provider value={cartValues}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
