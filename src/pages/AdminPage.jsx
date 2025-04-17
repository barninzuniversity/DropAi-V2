import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Components
import AdminNavigation from '../components/admin/AdminNavigation';

// Context
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is an admin
  useEffect(() => {
    // This checks if the user has admin rights
    if (isAuthenticated && user) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, user]);
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user is authenticated but not an admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        {/* Admin Navigation */}
        <AdminNavigation />
        
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600">
              Welcome to the admin dashboard. Use the navigation menu to manage your store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
