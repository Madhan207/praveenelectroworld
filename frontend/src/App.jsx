import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// User-facing layout & pages
import { MainLayout } from './layouts/MainLayout';
import { Home }       from './pages/Home';
import { Login }      from './pages/Login';
import { Register }   from './pages/Register';
import { Cart }       from './pages/Cart';
import { Checkout }   from './pages/Checkout';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Profile }    from './pages/Profile';
import { Search }     from './pages/Search';

// Admin layout & pages (Lazy loaded)
const AdminLayout      = lazy(() => import('./layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders      = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts    = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCustomers   = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminAnalytics   = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings    = lazy(() => import('./pages/admin/AdminSettings'));

// Route guards
import { AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── User-facing routes (with Navbar/Footer) ── */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="login"          element={<Login />} />
          <Route path="register"       element={<Register />} />
          <Route path="cart"           element={<Cart />} />
          <Route path="checkout"       element={<Checkout />} />
          <Route path="search"         element={<Search />} />
          <Route path="profile"        element={<Profile />} />
          <Route path="product/:slug"  element={<ProductDetail />} />
        </Route>

        {/* ── Admin routes (full-screen, no Navbar/Footer) ── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-900 text-white"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                <AdminLayout />
              </Suspense>
            </AdminRoute>
          }
        >
          <Route index           element={<AdminDashboard />} />
          <Route path="orders"   element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
