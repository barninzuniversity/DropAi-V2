import React, { createContext, useContext, useState } from 'react';

// Create context with default value
const SalesConfigContext = createContext({
  showSaleBanners: false,
  toggleSaleBanners: () => {},
});

export const SalesConfigProvider = ({ children }) => {
  // Default to not showing sale banners
  const [showSaleBanners, setShowSaleBanners] = useState(false);

  const toggleSaleBanners = () => {
    setShowSaleBanners(prev => !prev);
  };

  const value = {
    showSaleBanners,
    toggleSaleBanners,
  };

  return (
    <SalesConfigContext.Provider value={value}>
      {children}
    </SalesConfigContext.Provider>
  );
};

// Custom hook to use the sales config
export const useSalesConfig = () => {
  const context = useContext(SalesConfigContext);
  if (context === undefined) {
    throw new Error('useSalesConfig must be used within a SalesConfigProvider');
  }
  return context;
};

export default SalesConfigContext;