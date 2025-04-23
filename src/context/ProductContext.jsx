import React, { createContext, useContext, useState } from 'react';

// Put your initial inventory here (copy from inventoryProductsInit)
const initialInventory = [
  {
    id: 1,
    name: 'Modern Chair',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
    stock: 15,
    location: 'Warehouse A',
    category: 'Furniture',
    discounts: [
      { id: 1, name: 'Summer Sale', type: 'percentage', value: 10, active: true }
    ]
  },
  {
    id: 2,
    name: 'Designer Lamp',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
    stock: 8,
    location: 'Warehouse B',
    category: 'Lighting',
    discounts: []
  },
  {
    id: 3,
    name: 'Wooden Table',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
    stock: 5,
    location: 'Warehouse A',
    category: 'Furniture',
    discounts: [
      { id: 2, name: 'Clearance', type: 'percentage', value: 15, active: true }
    ]
  },
  {
    id: 4,
    name: 'Ceramic Vase',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
    stock: 20,
    location: 'Warehouse C',
    category: 'Decor',
    discounts: []
  }
];

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialInventory);

  // Utility functions can be added (add/edit/delete, etc.)
  const addProduct = (product) => setProducts(prev => [...prev, product]);
  const updateProduct = (updatedProduct) => setProducts(prev =>
    prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
  );
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));
  const setAllProducts = (all) => setProducts(all);

  // Create the context value object
  const contextValue = {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setAllProducts
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// Hook for easy access with error prevention
export function useProducts() {
  const context = useContext(ProductContext);
  
  // Add error checking to prevent undefined errors
  if (context === null || context === undefined) {
    console.error('useProducts must be used within a ProductProvider');
    // Return a default value to prevent destructuring errors
    return {
      products: [],
      setProducts: () => {},
      addProduct: () => {},
      updateProduct: () => {},
      deleteProduct: () => {},
      setAllProducts: () => {}
    };
  }
  
  return context;
}
