import React from 'react';

const AdminDashboard = ({ user }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          Welcome to the admin dashboard, {user?.name || 'Admin'}. Use the navigation menu to manage your store.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">Products</h3>
            <p className="text-sm text-gray-600">Manage your product catalog</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Inventory</h3>
            <p className="text-sm text-gray-600">Track and update product stock</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Discounts</h3>
            <p className="text-sm text-gray-600">Create and manage promotions</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Storage</h3>
            <p className="text-sm text-gray-600">Manage files and digital assets</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Settings</h3>
            <p className="text-sm text-gray-600">Configure your store preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;