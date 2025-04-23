import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/utils/ErrorBoundary';
import ScrollToTop from './components/utils/ScrollToTop';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <ErrorBoundary showDetails={false}>
      <ProductProvider>
        <AuthProvider>
          <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/profile" element={<AccountPage />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ErrorBoundary showDetails={true}>
                        <AdminPage />
                      </ErrorBoundary>
                    } 
                  />
                  <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <Footer />
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
          </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ProductProvider>
    </ErrorBoundary>
  );
}

export default App;
