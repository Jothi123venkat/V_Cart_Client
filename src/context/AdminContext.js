import React, { createContext, useContext, useState, useEffect } from 'react';

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
  }, []);

  const adminLogin = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const user = { email, role: 'admin', name: 'Admin' };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('admin_auth', JSON.stringify({ isAuthenticated: true, user }));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('admin_auth');
  };

  return (
    <AdminContext.Provider value={{ 
      isAdminAuthenticated, 
      adminUser, 
      adminLogin, 
      adminLogout 
    }}>
      {children}
    </AdminContext.Provider>
  );
};
