// Inventory Management Service
// This service manages the product inventory with localStorage for persistence

// Storage key for products
const STORAGE_KEY = 'dropai_products';
const ORDERS_KEY = 'dropai_orders';
const LAST_SAVE_KEY = 'dropai_last_save';
const DEFAULT_PRODUCTS_KEY = 'dropai_default_products';

// Reference to the current products
let productsCache = null;

/**
 * Initialize the inventory with default products if none exist
 * @param {Array} defaultProducts - Default products to use if no products exist in storage
 */
export const initializeInventory = (defaultProducts) => {
  // Only initialize if no products exist in storage
  const existingProducts = localStorage.getItem(STORAGE_KEY);
  
  if (!existingProducts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    localStorage.setItem(LAST_SAVE_KEY, new Date().toISOString());
    // Store default products for potential reset
    localStorage.setItem(DEFAULT_PRODUCTS_KEY, JSON.stringify(defaultProducts));
    productsCache = null; // Reset cache to force a fresh read next time
  }
};

/**
 * Reset inventory back to default products
 * @returns {boolean} True if reset was successful
 */
export const resetInventory = () => {
  try {
    const defaultProducts = localStorage.getItem(DEFAULT_PRODUCTS_KEY);
    
    if (defaultProducts) {
      // Restore the original products
      localStorage.setItem(STORAGE_KEY, defaultProducts);
      localStorage.setItem(LAST_SAVE_KEY, new Date().toISOString());
      productsCache = null;
      
      // Notify components about inventory change
      window.dispatchEvent(new CustomEvent('inventory-updated', {
        detail: { action: 'reset' }
      }));
      
      return true;
    } else {
      console.error('No default products found for reset');
      return false;
    }
  } catch (error) {
    console.error('Error resetting inventory:', error);
    return false;
  }
};

/**
 * Get all products from storage
 * @returns {Array} Array of product objects
 */
export const getProducts = () => {
  // IMPORTANT: Always get fresh data from localStorage
  // This ensures we don't show deleted products
  const productsJson = localStorage.getItem(STORAGE_KEY);
  
  if (productsJson) {
    // Parse from storage and update cache
    productsCache = JSON.parse(productsJson);
    return productsCache;
  }
  
  // Return empty array if no products exist
  return [];
};

/**
 * Get featured products based on high ratings only (not discounts)
 * @returns {Array} Array of featured product objects
 */
export const getFeaturedProducts = () => {
  const products = getProducts();
  return products.filter(product => 
    // Featured products criteria: high rating products only (4.5+ stars)
    product.rating && product.rating >= 4.5
  );
};

/**
 * Add a new product to the inventory
 * @param {Object} product - Product object to add
 * @returns {Object} The added product
 */
export const addProduct = (product) => {
  const products = getProducts();
  
  // Generate a new ID if none provided (would be handled by a real DB)
  if (!product.id) {
    const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
    product.id = maxId + 1;
  }
  
  // Add the new product
  products.push(product);
  
  // Save to storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  updateLastSaveTime();
  
  // Reset cache to force fresh read next time
  productsCache = null;
  
  return product;
};

/**
 * Update an existing product
 * @param {number} id - Product ID to update
 * @param {Object} updates - Object with product properties to update
 * @returns {Object|null} Updated product or null if not found
 */
export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the product
  products[index] = { ...products[index], ...updates };
  
  // Save to storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  updateLastSaveTime();
  
  // Reset cache to force fresh read next time
  productsCache = null;
  
  return products[index];
};

/**
 * Delete a product from the inventory
 * @param {number} id - Product ID to delete
 * @returns {boolean} True if product was deleted, false if not found
 */
export const deleteProduct = (id) => {
  const products = getProducts();
  const initialLength = products.length;
  
  // Filter out the product to delete
  const updatedProducts = products.filter(p => p.id !== id);
  
  if (updatedProducts.length === initialLength) {
    return false; // Product not found
  }
  
  // Save updated list to storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
  updateLastSaveTime();
  
  // Reset cache to force fresh read next time 
  productsCache = null;
  
  // Dispatch a custom event to notify components about the data change
  window.dispatchEvent(new CustomEvent('inventory-updated', {
    detail: { action: 'delete', productId: id }
  }));
  
  return true;
};

/**
 * Get a single product by ID
 * @param {number} id - Product ID to find
 * @returns {Object|null} Product object or null if not found
 */
export const getProductById = (id) => {
  const products = getProducts();
  return products.find(p => p.id === Number(id)) || null;
};

/**
 * Search products by query
 * @param {string} query - Search query
 * @returns {Array} Array of matching products
 */
export const searchProducts = (query) => {
  if (!query || query.trim() === '') {
    return getProducts();
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  const products = getProducts();
  
  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
    );
  });
};

/**
 * Update the stock level of a product
 * @param {number} id - Product ID to update
 * @param {number} newStock - New stock level
 * @returns {Object|null} Updated product or null if not found
 */
export const updateStock = (id, newStock) => {
  return updateProduct(id, { stock: newStock });
};

/**
 * Update stock for multiple products at once
 * @param {Array} updates - Array of objects with id and stock properties
 * @returns {Array} Array of updated products
 */
export const bulkUpdateStock = (updates) => {
  const products = getProducts();
  const updatedProducts = [];
  
  updates.forEach(update => {
    const index = products.findIndex(p => p.id === update.id);
    if (index !== -1) {
      products[index].stock = update.stock;
      updatedProducts.push(products[index]);
    }
  });
  
  // Save to storage if we made any updates
  if (updatedProducts.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    updateLastSaveTime();
    productsCache = null;
    
    // Notify components about inventory change
    window.dispatchEvent(new CustomEvent('inventory-updated', {
      detail: { action: 'bulkUpdate' }
    }));
  }
  
  return updatedProducts;
};

/**
 * Force save the current inventory to localStorage
 * Useful for admin interfaces where you want to ensure data is saved
 * @returns {boolean} True if save was successful
 */
export const forceSaveInventory = () => {
  try {
    const products = getProducts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    updateLastSaveTime();
    
    // Notify components about inventory change
    window.dispatchEvent(new CustomEvent('inventory-updated', {
      detail: { action: 'forceSave' }
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving inventory:', error);
    return false;
  }
};

/**
 * Get the timestamp of the last inventory save
 * @returns {string} ISO timestamp string
 */
export const getLastSaveTime = () => {
  const timestamp = localStorage.getItem(LAST_SAVE_KEY);
  return timestamp || new Date().toISOString();
};

/**
 * Update the last save timestamp
 * @private
 */
const updateLastSaveTime = () => {
  localStorage.setItem(LAST_SAVE_KEY, new Date().toISOString());
};

/**
 * Validate if all items in cart have enough stock available
 * @param {Array} cartItems - Array of cart items with product IDs and quantities
 * @returns {Object} Validation result with success flag and any unavailable items
 */
export const validateStockAvailability = (cartItems) => {
  const products = getProducts();
  const unavailableItems = [];

  for (const item of cartItems) {
    const product = products.find(p => p.id === item.id);
    
    // Check if product exists and has enough stock
    if (!product) {
      unavailableItems.push({
        id: item.id,
        name: item.name || 'Unknown Product',
        reason: 'Product no longer available'
      });
    } else if (product.stock < item.quantity) {
      unavailableItems.push({
        id: product.id,
        name: product.name,
        available: product.stock,
        requested: item.quantity,
        reason: `Only ${product.stock} items available`
      });
    }
  }

  return {
    success: unavailableItems.length === 0,
    unavailableItems
  };
};

/**
 * Process an order by deducting items from inventory
 * @param {Object} order - Order object with items, customer info, etc.
 * @returns {Object} Result with success flag and order details
 */
export const processOrder = (order) => {
  // First validate stock availability
  const validation = validateStockAvailability(order.items);
  
  if (!validation.success) {
    return {
      success: false,
      reason: 'Some items are no longer available',
      unavailableItems: validation.unavailableItems
    };
  }
  
  // If validation passed, update product stock
  const products = getProducts();
  
  // Update each product's stock
  for (const item of order.items) {
    const productIndex = products.findIndex(p => p.id === item.id);
    if (productIndex !== -1) {
      products[productIndex].stock -= item.quantity;
    }
  }
  
  // Save updated products
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  updateLastSaveTime();
  
  // Reset cache
  productsCache = null;
  
  // Save order to order history
  const ordersJson = localStorage.getItem(ORDERS_KEY) || '[]';
  const orders = JSON.parse(ordersJson);
  
  // Create a new order with timestamp and ID
  const processedOrder = {
    ...order,
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'processing'
  };
  
  orders.push(processedOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  // Notify components about inventory change
  window.dispatchEvent(new CustomEvent('inventory-updated', {
    detail: { action: 'order', orderId: processedOrder.id }
  }));
  
  return {
    success: true,
    order: processedOrder
  };
};

// Export a function to force refresh the cache
export const refreshInventory = () => {
  productsCache = null;
  return getProducts();
};
