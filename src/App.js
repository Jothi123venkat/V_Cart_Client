import React from 'react'
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Home from './Components/Main/Home'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/NavBar/Navbar'
import Products from './Components/Productpage/Products'
import Addproduct from './Components/AddProduct/Addproduct'
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
import SupportManagement from './Components/Admin/SupportManagement'
import InventoryManagement from './Components/Admin/InventoryManagement'

const App = () => {

  return (
    <AuthProvider>
      <AdminProvider>
        <ProductProvider>
        <CartProvider>
        <div>
            <Navbar />

          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Products/>} />
            <Route path="/Yourorders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/addproduct" element={<Addproduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<Addproduct />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="promotions" element={<PromotionManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="support" element={<SupportManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
            </Route>
          </Routes>
          
        </div>
        </CartProvider>
      </ProductProvider>
    </AdminProvider>
    </AuthProvider>
  )
}

export default App