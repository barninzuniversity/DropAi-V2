/**
 * Inventory Update Service
 * Handles stock updates when products are ordered
 */

/**
 * Updates product stock after an order is placed
 * @param {Array} orderedItems - Array of items in the order with product id and quantity
 * @param {Function} updateStockCallback - Callback function to update stock in database/store
 * @returns {Promise} - Resolution with success status
 */
export const decrementStock = async (orderedItems, updateStockCallback) => {
  try {
    // Process each ordered item and update stock
    for (const item of orderedItems) {
      const { productId, quantity } = item;
      
      // Call the updateStockCallback with negative quantity to decrement stock
      await updateStockCallback(productId, -quantity);
    }
    
    return { success: true, message: 'Inventory updated successfully' };
  } catch (error) {
    console.error('Error updating inventory:', error);
    return { success: false, message: 'Failed to update inventory', error };
  }
};

/**
 * Validates if there is sufficient stock before completing an order
 * @param {Array} orderedItems - Array of items with product id and quantity
 * @param {Array} products - Current product inventory with stock information
 * @returns {Object} - Validation result with success status
 */
export const validateStockAvailability = (orderedItems, products) => {
  const insufficientItems = [];
  
  for (const item of orderedItems) {
    const { productId, quantity } = item;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      insufficientItems.push({ 
        productId, 
        message: 'Product not found' 
      });
      continue;
    }
    
    if (product.stock < quantity) {
      insufficientItems.push({ 
        productId, 
        name: product.name,
        requested: quantity, 
        available: product.stock,
        message: `Only ${product.stock} units available`
      });
    }
  }
  
  return {
    success: insufficientItems.length === 0,
    insufficientItems
  };
};