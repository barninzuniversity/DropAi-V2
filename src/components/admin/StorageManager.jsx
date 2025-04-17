import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiMinus, FiRefreshCw, FiCheck, FiDatabase } from 'react-icons/fi';
import { updateStock, getProducts, forceSaveInventory, bulkUpdateStock, getLastSaveTime } from '../../utils/inventoryService';

const StorageManager = ({ products, refreshProducts }) => {
  const [stockUpdates, setStockUpdates] = useState({});
  const [lastSaveTime, setLastSaveTime] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load last save time on component mount
  useEffect(() => {
    setLastSaveTime(getLastSaveTime());
  }, []);

  // Handle stock input change
  const handleStockChange = (productId, newValue) => {
    setStockUpdates({
      ...stockUpdates,
      [productId]: parseInt(newValue, 10) || 0
    });
  };

  // Increment stock value
  const incrementStock = (productId, currentStock) => {
    const currentUpdate = stockUpdates[productId] !== undefined ? stockUpdates[productId] : currentStock;
    setStockUpdates({
      ...stockUpdates,
      [productId]: currentUpdate + 1
    });
  };

  // Decrement stock value
  const decrementStock = (productId, currentStock) => {
    const currentUpdate = stockUpdates[productId] !== undefined ? stockUpdates[productId] : currentStock;
    const newValue = Math.max(0, currentUpdate - 1); // Prevent negative stock
    setStockUpdates({
      ...stockUpdates,
      [productId]: newValue
    });
  };

  // Reset stock value to original
  const resetStock = (productId, originalStock) => {
    const updates = { ...stockUpdates };
    delete updates[productId];
    setStockUpdates(updates);
  };

  // Apply a single stock update
  const applyStockUpdate = (productId) => {
    if (stockUpdates[productId] !== undefined) {
      updateStock(productId, stockUpdates[productId]);
      
      // Remove from pending updates
      const updates = { ...stockUpdates };
      delete updates[productId];
      setStockUpdates(updates);
      
      // Refresh the product list
      refreshProducts();
      
      // Update last save time
      setLastSaveTime(getLastSaveTime());
      
      // Show success indicator briefly
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Save all pending stock updates
  const saveAllUpdates = () => {
    if (Object.keys(stockUpdates).length === 0) {
      return;
    }
    
    const updates = Object.entries(stockUpdates).map(([id, stock]) => ({
      id: parseInt(id, 10),
      stock
    }));
    
    bulkUpdateStock(updates);
    setStockUpdates({});
    refreshProducts();
    
    // Update last save time
    setLastSaveTime(getLastSaveTime());
    
    // Show success indicator briefly
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Format date for display
  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (e) {
      return 'Unknown';
    }
  };

  // Force save inventory
  const handleForceSave = () => {
    forceSaveInventory();
    setLastSaveTime(getLastSaveTime());
    
    // Show success indicator briefly
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Inventory Management</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            Last saved: {formatDate(lastSaveTime)}
          </span>
          <button 
            onClick={handleForceSave}
            className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            title="Force save inventory"
          >
            <FiDatabase size={16} />
          </button>
          {saveSuccess && (
            <span className="ml-2 text-green-500 flex items-center">
              <FiCheck className="mr-1" /> Saved
            </span>
          )}
        </div>
      </div>
      
      {Object.keys(stockUpdates).length > 0 && (
        <div className="mb-4 flex justify-between items-center bg-blue-50 p-2 rounded">
          <span className="text-sm text-blue-700">You have {Object.keys(stockUpdates).length} unsaved changes</span>
          <button 
            onClick={saveAllUpdates}
            className="btn btn-sm btn-primary"
          >
            <FiSave className="mr-1" /> Save All
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => {
              const hasChanges = stockUpdates[product.id] !== undefined;
              const currentStock = hasChanges ? stockUpdates[product.id] : product.stock;
              
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={currentStock}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        className={`w-20 p-1 border rounded text-center ${hasChanges ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
                      />
                      <div className="flex flex-col ml-2">
                        <button 
                          onClick={() => incrementStock(product.id, product.stock)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiPlus size={14} />
                        </button>
                        <button 
                          onClick={() => decrementStock(product.id, product.stock)}
                          className="text-gray-500 hover:text-gray-700 mt-1"
                        >
                          <FiMinus size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {hasChanges && (
                        <>
                          <button
                            onClick={() => applyStockUpdate(product.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Save this change"
                          >
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={() => resetStock(product.id, product.stock)}
                            className="text-red-600 hover:text-red-900"
                            title="Reset to original"
                          >
                            <FiRefreshCw size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StorageManager;