import React from 'react'
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import ProtectedUserRoute from './Components/Auth/ProtectedUserRoute';
import Home from './Components/Main/Home'
import { Route, Routes, Outlet } from 'react-router-dom'
import Navbar from './Components/NavBar/Navbar'
import Products from './Components/Productpage/Products'
import ProductDetails from './Components/Productpage/ProductDetails'
import ProductManagement from './Components/Admin/ProductManagement'
import Cart from './Components/Cart/Cart'
import Orders from './Your_orders/Orders'
import Checkout from './Components/Checkout/Checkout'
import AdminLogin from './Components/Admin/AdminLogin'
import AdminLayout from './Components/Admin/AdminLayout'
import AdminDashboard from './Components/Admin/AdminDashboard'
import UserProfile from './Components/User/UserProfile';
import ProtectedAdminRoute from './Components/Admin/ProtectedAdminRoute'
import CategoryManagement from './Components/Admin/CategoryManagement'
import OrderManagement from './Components/Admin/OrderManagement'
import PromotionManagement from './Components/Admin/PromotionManagement'
import Analytics from './Components/Admin/Analytics'
import UserManagement from './Components/Admin/UserManagement'
import AdminTickets from './Components/Admin/AdminTickets'
import SupportPage from './Components/Support/SupportPage';
import InventoryManagement from './Components/Admin/InventoryManagement'
import Footer from './Components/Footer/Footer';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const App = () => {

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <AdminProvider>
        <ProductProvider>
        <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
          
          <Routes>
            {/* Public Routes with Navbar/Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Products/>} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              
              {/* Protected User Routes (Still use Public Layout) */}
              <Route path="/Yourorders" element={
                <ProtectedUserRoute>
                  <Orders />
                </ProtectedUserRoute>
              } />
              <Route path="/cart" element={
                <ProtectedUserRoute>
                  <Cart />
                </ProtectedUserRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedUserRoute>
                  <Checkout />
                </ProtectedUserRoute>
              } />
              <Route path="/profile" element={
                <ProtectedUserRoute>
                  <UserProfile />
                </ProtectedUserRoute>
              } />
              <Route path="/support" element={
                <ProtectedUserRoute>
                  <SupportPage />
                </ProtectedUserRoute>
              } />
            </Route>
            
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="promotions" element={<PromotionManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="support" element={<AdminTickets />} />
              <Route path="inventory" element={<InventoryManagement />} />
            </Route>

            {/* Fallback for AddProduct standalone if needed or move to admin */}
             <Route path="/addproduct" element={
                <ProtectedAdminRoute>
                    <ProductManagement />
                </ProtectedAdminRoute>
             } />

          </Routes>
          
        </div>
        </CartProvider>
      </ProductProvider>
    </AdminProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App