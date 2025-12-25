import React, { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Button
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
  Support,
  Notifications,
  Circle
} from '@mui/icons-material';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const drawerWidth = 260;

const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Products', icon: <Inventory />, path: '/admin/products' },
  { text: 'Inventory', icon: <Assessment />, path: '/admin/inventory' },
  { text: 'Categories', icon: <Category />, path: '/admin/categories' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Promotions', icon: <LocalOffer />, path: '/admin/promotions' },
  { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
  { text: 'Support', icon: <Support />, path: '/admin/support' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { adminUser, adminLogout } = useAdmin();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('vcart_token');
      if (!token) return;
      
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.notifications.base}`, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Fetch notifications error", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.notifications.markRead(id)}`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchNotifications();
      
      // Navigate to the target link
      if (link) {
        navigate("/admin/support");
      } else {
        // Fallback for ticket notifications specifically mentioned by user
        navigate('/admin/support');
      }
      
      handleNotificationClose();
    } catch (err) {
      console.error("Mark as read error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.notifications.markAllRead}`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Mark all as read error", err);
    }
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            {/* Notifications Bell */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationClick} sx={{ color: '#64748b' }}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notifications Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: { 
                  width: 320, 
                  maxHeight: 400,
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                {unreadCount > 0 && (
                  <Typography 
                    variant="caption" 
                    sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Typography>
                )}
              </Box>
              <Divider />
              {notifications.length === 0 ? (
                <MenuItem sx={{ py: 3, justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((notif) => (
                  <MenuItem 
                    key={notif._id} 
                    onClick={() => markAsRead(notif._id, notif.link)}
                    sx={{ 
                      py: 1.5, 
                      px: 2, 
                      whiteSpace: 'normal',
                      bgcolor: notif.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                      borderLeft: notif.isRead ? 'none' : '4px solid #1976d2',
                      display: 'block'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={notif.isRead ? 500 : 700}>
                        {notif.title}
                      </Typography>
                      {!notif.isRead && <Circle sx={{ fontSize: 10, color: '#1976d2', mt: 0.5 }} />}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {formatRelativeTime(notif.date)}
                    </Typography>
                  </MenuItem>
                ))
              )}
              <Divider />
              <Box sx={{ p: 1.5, textAlign: 'center' }}>
                <Button 
                  fullWidth 
                  size="small" 
                  variant="outlined" 
                  onClick={() => { navigate('/admin/support'); handleNotificationClose(); }}
                >
                  View All Tickets
                </Button>
              </Box>
            </Menu>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 2 }} />

            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' }, ml: 1 }}>
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
