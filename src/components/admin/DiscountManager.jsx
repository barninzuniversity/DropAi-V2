import React from 'react';

const DiscountManager = () => {
  // This component has been disabled as the discount system has been removed
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discount Management</h2>
        <div className="text-gray-500">Discounts have been disabled</div>
      </div>
      
      <div className="p-8 text-center text-gray-500">
        <p>The discount system has been removed from the application.</p>
        <p className="mt-2">To implement custom pricing, please update product prices directly in the product management section.</p>
      </div>
    </div>
  );
};

export default DiscountManager;
