import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

const CartIcon = () => {
  const totalItems = useCartStore((state) => state.totalItems);
  
  return (
    <Link to="/cart" className="relative flex items-center text-gray-600 hover:text-primary-600 transition-colors">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;