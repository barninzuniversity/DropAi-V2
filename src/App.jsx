import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/utils/ErrorBoundary';
import ScrollToTop from './components/utils/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminSetup from './components/admin/AdminSetup';

// Context Providers
import { ProductProvider } from './context/ProductContext';
import { SalesConfigProvider } from './context/SalesConfigContext';

// Store
import useAuthStore from './store/authStore';

// Lazy-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

function App() {
  // Initialize auth store
  const initAuth = useAuthStore(state => state.init);
  const isLoading = useAuthStore(state => state.isLoading);
  
  useEffect(() => {
    // Initialize auth store when app loads
    initAuth();
  }, [initAuth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary showDetails={false}>
        <SalesConfigProvider>
          <ProductProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            {/* No sales banner here */}
            <main className="flex-grow">
              <Suspense 
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                }
              >
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route 
                      path="/checkout" 
                      element={<ProtectedRoute element={<CheckoutPage />} />} 
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route 
                      path="/profile" 
                      element={<ProtectedRoute element={<AccountPage />} />} 
                    />
                    <Route 
                      path="/admin/*" 
                      element={
                        <ErrorBoundary showDetails={true}>
                          <ProtectedRoute 
                            element={<AdminPage />} 
                            requiredRole="admin"
                          />
                        </ErrorBoundary>
                      } 
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </main>
            <Footer />
            <AdminSetup />
          </div>

          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          </ProductProvider>
        </SalesConfigProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
