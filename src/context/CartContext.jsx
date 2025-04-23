import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

// Create the cart context
const CartContext = createContext(null);

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });
  
  const [loading, setLoading] = useState(false);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Add an item to the cart
  const addItem = (product, quantity = 1) => {
    if (!product) {
      console.error("Cannot add undefined or null product to cart");
      return;
    }
    
    // Ensure we have a valid ID
    const productId = String(product.id);
    
    setItems(currentItems => {
      // Check if the item is already in the cart
      const existingItemIndex = currentItems.findIndex(item => String(item.id) === productId);
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        toast.success(`Added ${product.name} to cart`);
        return [...currentItems, { ...product, quantity }];
      }
    });
  };
  
  // Remove an item from the cart
  const removeItem = (productId) => {
    // Convert ID to string for consistent comparison
    const idStr = String(productId);
    
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => String(item.id) === idStr);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }
      return currentItems.filter(item => String(item.id) !== idStr);
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    // Convert ID to string for consistent comparison
    const idStr = String(productId);
    
    setItems(currentItems => 
      currentItems.map(item => 
        String(item.id) === idStr ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear the cart
  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };
  
  // Calculate total price
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Calculate total number of items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  const cartValues = {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    total: calculateTotal(),
    isEmpty: items.length === 0
  };
  
  return (
    <CartContext.Provider value={cartValues}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
