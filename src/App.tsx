import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Policies from './pages/Policies';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import SocialFloat from './components/common/SocialFloat';
import { ProductProvider } from './context/ProductContext';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBrands from './pages/admin/AdminBrands';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <ProductProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ve-tiem" element={<About />} />
          <Route path="/chinh-sach" element={<Policies />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <SocialFloat />
      </Router>
    </ProductProvider>
  );
}

export default App;

