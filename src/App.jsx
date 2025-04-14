import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PurchaseConfirmationPage from './pages/PurchaseConfirmationPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute'

// Components
import Loader from './components/ui/Loader'
import Notification from './components/ui/Notification'

// Store
import useNotificationStore from './store/notificationStore'
import useAuthStore from './store/authStore'

function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const { notification, hideNotification } = useNotificationStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Show loader briefly on initial load
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Load products from API or local data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // This would be replaced with an actual API call in production
        const data = await import('./data/products.js').catch(() => ({ default: [] }));
        setProducts(data.default || []);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, []);
  
  // Handle updating product stock
  const handleUpdateProductStock = (productId, newStock) => {
    console.log(`Updating product ${productId} stock to ${newStock}`);
    
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock } 
          : product
      )
    );
    
    // In a real application, you would also update the backend
    // Example: apiService.updateProductStock(productId, newStock);
  };

  // Return the loader while loading
  if (loading) {
    return <Loader />
  }

  return (
    <>
      {/* Global notification component */}
      <Notification 
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        autoCloseTime={notification.autoCloseTime}
        position={notification.position}
        showIcon={notification.showIcon}
        onClose={hideNotification}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage products={products} />} />
            <Route path="/products/:id" element={<ProductDetailPage products={products} updateProductStock={handleUpdateProductStock} />} />
            <Route path="/cart" element={<CartPage products={products} updateProductStock={handleUpdateProductStock} />} />
            <Route path="/checkout" element={<CheckoutPage products={products} updateProductStock={handleUpdateProductStock} />} />
            <Route path="/purchase-confirmation" element={<PurchaseConfirmationPage products={products} updateProductStock={handleUpdateProductStock} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProtectedRoute element={<AccountPage />} />} />
            <Route path="/admin" element={
              <ProtectedRoute 
                element={
                  <AdminPage 
                    products={products}
                    onAddProduct={(product) => setProducts([...products, product])}
                    onUpdateProduct={(updatedProduct) => 
                      setProducts(products.map(p => 
                        p.id === updatedProduct.id ? updatedProduct : p
                      ))
                    }
                    onDeleteProduct={(productId) => 
                      setProducts(products.filter(p => p.id !== productId))
                    }
                    onUpdateStock={handleUpdateProductStock}
                  />
                } 
                requiredRole="admin" 
              />
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
