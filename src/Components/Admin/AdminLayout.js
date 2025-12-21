import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  LocalOffer,
  Assessment,
  Settings,
  Logout,
  Category,
  Support
} from '@mui/icons-material';
import { useAdmin } from '../../context/AdminContext';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Products', icon: <Inventory />, path: '/admin/products' },
  { text: 'Inventory', icon: <Assessment />, path: '/admin/inventory' },
  { text: 'Categories', icon: <Category />, path: '/admin/categories' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  // Keeping extras as they add value
  { text: 'Promotions', icon: <LocalOffer />, path: '/admin/promotions' },
  { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
  { text: 'Support', icon: <Support />, path: '/admin/support' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { adminUser, adminLogout } = useAdmin();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f3f4f6' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1, 
            bgcolor: 'white', 
            color: '#333',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        elevation={0}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#1b2430' }}>
            V-CART ADMIN
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold">{adminUser?.name || 'Administrator'}</Typography>
                <Typography variant="caption" color="text.secondary">{adminUser?.email}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#1b2430', color: '#c5a059' }}>
              {adminUser?.name?.charAt(0) || 'A'}
            </Avatar>
            <IconButton onClick={handleLogout} sx={{ color: '#64748b' }}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1b2430', // Dark Navy
            color: '#cbd5e1',
            borderRight: 'none'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 3 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                        mx: 2,
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        '&.Mui-selected': { bgcolor: '#c5a059', color: 'white' }
                    }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 20, color: 'inherit' } })}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, minHeight: '100vh', mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
