import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiBox, 
  FiShoppingBag, 
  FiTag, 
  FiBarChart2, 
  FiDatabase, 
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdminNavigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <FiBarChart2 className="mr-3 h-5 w-5" /> 
    },
    { 
      name: 'Products', 
      path: '/admin/products', 
      icon: <FiBox className="mr-3 h-5 w-5" /> 
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
    <div className="admin-navigation">
      {/* Mobile menu button */}
      <div className="lg:hidden p-4 flex items-center justify-between bg-white border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <button 
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <nav className="bg-white px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
