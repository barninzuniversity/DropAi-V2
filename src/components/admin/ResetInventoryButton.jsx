import React, { useState } from 'react';
import { clearInventory, initializeInventory } from '../../utils/inventoryService';
import { allProducts } from '../../data/products';

/**
 * Admin component to reset inventory for debugging purposes
 */
const ResetInventoryButton = ({ refreshProducts }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  
  const handleReset = () => {
    if (isConfirming) {
      // Reset the inventory to the default state
      clearInventory();
      initializeInventory(allProducts);
      
      // Refresh the products in the UI
      if (refreshProducts && typeof refreshProducts === 'function') {
        refreshProducts();
      }
      
      // Reset confirmation state
      setIsConfirming(false);
    } else {
      // First click - ask for confirmation
      setIsConfirming(true);
    }
  };
  
  return (
    <div className="mt-6">
      <button
        onClick={handleReset}
        className={`px-4 py-2 rounded ${
          isConfirming ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'
        } text-white transition-colors`}
      >
        {isConfirming ? 'Confirm Reset to Default Inventory' : 'Reset Inventory'}
      </button>
      {isConfirming && (
        <p className="mt-2 text-sm text-red-600">
          Warning: This will delete all inventory changes and restore the default products!
        </p>
      )}
    </div>
  );
};

export default ResetInventoryButton;