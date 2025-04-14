import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/priceFormatter';

/**
 * Reusable Order Summary component
 * @param {Object} props
 * @param {number} props.subtotal - Order subtotal
 * @param {number} props.shipping - Shipping cost (7 TND)
 * @param {boolean} props.showCheckoutButton - Whether to show the checkout button
 * @param {string} props.className - Additional CSS classes
 */
const OrderSummary = ({ 
  subtotal, 
  shipping = 7, 
  showCheckoutButton = true,
  className = '' 
}) => {
  const total = subtotal + shipping;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-xl">{formatPrice(total)}</span>
        </div>
      </div>
      
      {showCheckoutButton && (
        <Link to="/checkout" className="btn btn-primary w-full">
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
};

export default OrderSummary;