import { useState, useEffect, useCallback } from 'react';
import { getProducts, getFeaturedProducts as getFeatured, refreshInventory } from '../utils/inventoryService';

/**
 * Custom hook for managing products with automatic updates
 * @param {Object} options - Configuration options
 * @param {boolean} options.featured - Whether to fetch only featured products
 * @param {number} options.limit - Maximum number of products to return
 * @returns {Object} Products state and utility functions
 */
const useProducts = (options = {}) => {
  const { featured = false, limit } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load products
  const loadProducts = useCallback(() => {
    try {
      setLoading(true);
      // Get products based on options
      const data = featured ? getFeatured() : getProducts();
      
      // Apply limit if specified
      const limitedData = limit ? data.slice(0, limit) : data;
      
      setProducts(limitedData);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [featured, limit]);

  // Load products on initial mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Set up listeners for inventory updates
  useEffect(() => {
    const handleInventoryUpdate = () => {
      console.log('Product data refreshed due to inventory update');
      loadProducts();
    };

    // Listen for our custom inventory-updated event
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    
    // Also refresh when window gets focus (user returns to the tab)
    window.addEventListener('focus', handleInventoryUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('inventory-updated', handleInventoryUpdate);
      window.removeEventListener('focus', handleInventoryUpdate);
    };
  }, [loadProducts]);

  // Manual refresh function
  const refreshProducts = useCallback(() => {
    refreshInventory();
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts
  };
};

export default useProducts;