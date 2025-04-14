/**
 * Utility functions for formatting prices across the website
 */

/**
 * Format price with Tunisian Dinar (TND) currency symbol
 * @param {number} price - The price to format
 * @param {boolean} includeDecimals - Whether to include decimal places (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, includeDecimals = true) => {
  if (price === null || price === undefined) return '';
  if (includeDecimals) {
    return `${price.toFixed(2)} TND`;
  }
  return `${Math.round(price)} TND`;
};

/**
 * Default export for easier importing
 */
export default {
  formatPrice,
  calculateDiscountedPrice,
  calculateOriginalPrice,
  formatDiscount,
  calculateSavings,
  formatSavings,
  processProductPrices,
  getFormattedProductPrice,
  formatPriceRange
};

/**
 * Calculate the discounted price from an original price and discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} discountPercentage - The discount percentage (e.g. 20 for 20%)
 * @returns {number} The price after discount
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  if (!discountPercentage) return originalPrice;
  const discountedPrice = originalPrice * (1 - (discountPercentage / 100));
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(discountedPrice * 100) / 100;
};

/**
 * Format a price range
 * @param {number} minPrice - The minimum price
 * @param {number} maxPrice - The maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

/**
 * Calculate the original price from a discounted price and discount percentage
 * @param {number} discountedPrice - The price after discount 
 * @param {number} discountPercentage - The discount percentage (e.g. 20 for 20%)
 * @returns {number} The original price
 */
export const calculateOriginalPrice = (discountedPrice, discountPercentage) => {
  if (!discountPercentage) return discountedPrice;
  const originalPrice = discountedPrice / (1 - (discountPercentage / 100));
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(originalPrice * 100) / 100;
};

/**
 * Format discount percentage
 * @param {number} percentage - The discount percentage
 * @returns {string} Formatted discount string
 */
export const formatDiscount = (percentage) => {
  return `-${percentage}%`;
};

/**
 * Calculate the amount saved from a discount
 * @param {number} originalPrice - The original price
 * @param {number} discountedPrice - The price after discount
 * @returns {number} The amount saved
 */
export const calculateSavings = (originalPrice, discountedPrice) => {
  return originalPrice - discountedPrice;
};

/**
 * Format the amount saved as a string
 * @param {number} savings - The amount saved
 * @returns {string} Formatted savings string
 */
export const formatSavings = (savings) => {
  return `Save ${formatPrice(savings)}`;
};

/**
 * Process product with discount for cart/checkout
 * Ensures consistent price structure with both original and discounted prices
 * 
 * @param {Object} product - Product object
 * @returns {Object} Processed product with standardized price properties
 */
export const processProductPrices = (product) => {
  // Default case - no discount
  if (!product.discount && !product.discountPercentage) {
    return {
      ...product,
      finalPrice: product.price,
      originalPrice: product.price,
      hasDiscount: false,
      discountPercentage: 0
    };
  }
  
  // Get the discount percentage (different products may use different property names)
  const discountPercentage = product.discount || product.discountPercentage || 0;
  
  // Calculate final price if we have original price and discount
  const finalPrice = calculateDiscountedPrice(product.price, discountPercentage);
  
  return {
    ...product,
    finalPrice: finalPrice,
    originalPrice: product.price,
    hasDiscount: true,
    discountPercentage: discountPercentage
  };
};

/**
 * Format price for display in product listings
 * Returns all price-related display information
 * 
 * @param {Object} product - The product with price and discount information
 * @returns {Object} Formatted price information for display
 */
export const getFormattedProductPrice = (product) => {
  const processedProduct = processProductPrices(product);
  const hasDiscount = processedProduct.hasDiscount;
  
  return {
    currentPrice: formatPrice(processedProduct.finalPrice),
    originalPrice: hasDiscount ? formatPrice(processedProduct.originalPrice) : null,
    discountLabel: hasDiscount ? formatDiscount(processedProduct.discountPercentage) : null,
    savingsAmount: hasDiscount ? 
      formatSavings(calculateSavings(processedProduct.originalPrice, processedProduct.finalPrice)) : null,
    hasDiscount
  };
};
