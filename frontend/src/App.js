import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

// Security Core - Attribution Protection System
import './utils/securityCore';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              {/* Simple Header */}
              <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-gray-900">E-Commerce Platform</h1>
                    <nav className="flex space-x-4">
                      <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                      <a href="/products" className="text-gray-600 hover:text-gray-900">Products</a>
                      <a href="/cart" className="text-gray-600 hover:text-gray-900">Cart</a>
                    </nav>
                  </div>
                </div>
              </header>
              
              <main className="flex-1 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                  </Routes>
                </div>
              </main>
              
              {/* Simple Footer */}
              <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <p className="text-center text-gray-600">© 2024 E-Commerce Platform. All rights reserved.</p>
                </div>
              </footer>
              
              <Toaster position="top-right" />
            </div>
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;