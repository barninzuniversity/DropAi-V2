import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiBox, 
  FiShoppingBag, 
  FiTag, 
  FiDatabase, 
  FiSettings, 
  FiMenu, 
  FiX, 
  FiUsers, 
  FiPackage,
  FiHome
} from 'react-icons/fi';

const AdminNavigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if a path is active (either exact or as a parent route)
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <FiHome className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Products', 
      path: '/admin/products', 
      icon: <FiBox className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Orders', 
      path: '/admin/orders', 
      icon: <FiPackage className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Customers', 
      path: '/admin/customers', 
      icon: <FiUsers className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: <FiBarChart2 className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Inventory', 
      path: '/admin/inventory', 
      icon: <FiShoppingBag className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Discounts', 
      path: '/admin/discounts', 
      icon: <FiTag className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Storage', 
      path: '/admin/storage', 
      icon: <FiDatabase className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <FiSettings className="mr-3 h-5 w-5" /> 
    }
  ];
  
  return (
    <div className="admin-navigation w-full h-full">
      {/* Mobile menu button */}
      <div className="lg:hidden p-4 flex items-center justify-between bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button 
          onClick={toggleMenu}
          className="text-white hover:text-blue-200 focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <nav className="bg-white px-2 pt-2 pb-4 space-y-1 shadow-md">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="flex-1">{item.name}</span>
                {isActive(item.path) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden lg:block h-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex items-center flex-shrink-0 px-4 py-5 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* Simple admin footer */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <NavLink
              to="/"
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Store
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
