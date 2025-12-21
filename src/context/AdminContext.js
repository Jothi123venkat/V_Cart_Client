import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'erjothivenkat2002@gmail.com',
  password: 'Venkat@2002'
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminData = localStorage.getItem('admin_auth');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      if (parsed.isAuthenticated) {
        setIsAdminAuthenticated(true);
        setAdminUser(parsed.user);
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    // 1. Check Hardcoded First (to enforce admin-only email restrictions if desired, or just use as validation)
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      try {
        // 2. Attempt API Login to get Token
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        const { token, user } = res.data;
        
        handleAuthSuccess(user, token);
        return { success: true };

      } catch (err) {
        // 3. If Login Failed (likely user doesn't exist in DB), Attempt Registration
        if (err.response && err.response.status === 400) {
           console.log("Admin user not found in DB, attempting to register...");
           try {
             const regRes = await axios.post(`${API_BASE_URL}/api/auth/signup`, { 
               name: 'Admin', 
               email, 
               password 
             });
             const { token, user } = regRes.data;
             handleAuthSuccess(user, token);
             return { success: true };

           } catch (regErr) {
             console.error("Registration failed", regErr);
             return { success: false, message: 'DB Sync Failed: ' + (regErr.response?.data?.message || regErr.message) };
           }
        }
        return { success: false, message: 'Authentication Failed: ' + (err.response?.data?.message || err.message) };
      }
    }
    return { success: false, message: 'Invalid Admin Credentials' };
  };

  const handleAuthSuccess = (user, token) => {
      const adminData = { ...user, role: 'admin' };
      setIsAdminAuthenticated(true);
      setAdminUser(adminData);
      
      // Store in BOTH locations to satisfy different parts of the app
      localStorage.setItem('admin_auth', JSON.stringify({ isAuthenticated: true, user: adminData }));
      localStorage.setItem('vcart_token', token); 
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('vcart_token');
  };

  return (
    <AdminContext.Provider value={{ 
      isAdminAuthenticated, 
      adminUser, 
      loading,
      adminLogin, 
      adminLogout 
    }}>
      {!loading && children}
    </AdminContext.Provider>
  );
};
