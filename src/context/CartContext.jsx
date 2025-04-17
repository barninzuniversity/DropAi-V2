import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

// Create the cart context
const CartContext = createContext(null);

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);
  
  // Add an item to the cart
  const addItem = (product, quantity = 1) => {
    setItems(currentItems => {
      // Check if the item is already in the cart
      const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
      
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
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }
      return currentItems.filter(item => item.id !== productId);
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
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
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
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