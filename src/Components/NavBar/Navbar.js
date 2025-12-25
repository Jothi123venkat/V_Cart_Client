import * as React from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import CreateTicket from '../Support/CreateTicket';
import { HelpOutline, Logout, ArrowDropDown, LocationOn, Notifications, Circle } from '@mui/icons-material';
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import StorefrontIcon from "@mui/icons-material/Storefront";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import io from 'socket.io-client';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

// Amazon-like Styles
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    flexGrow: 1,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#febd69', // Amazon orange
  color: 'black',
  borderTopRightRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  zIndex: 1
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 6, 1.5, 2), // Vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: '100%',
    color: 'black'
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { products } = useProducts();
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();

      const socket = io(API_BASE_URL);
      socket.on('newNotification', ({ userId, notification }) => {
        if (userId === user?._id) {
          setNotifications(prev => [notification, ...prev]);
        }
      });

      return () => socket.disconnect();
    }
  }, [isAuthenticated, user?._id]);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.notifications.base}`, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Load notifications error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.notifications.markAllRead}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark read error", err);
    }
  };

  const handleNotifOpen = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElUser(null);
    setMobileMoreAnchorEl(null);
  };

  const handleSearch = (e) => {
      e.preventDefault();
      if(searchQuery.trim()) {
          navigate(`/products?search=${searchQuery}`);
      }
  }
  
  const handleLogout = () => {
      logout();
      handleMenuClose();
      navigate('/login');
  }

  const categories = [...new Set(products.map(p => (p.category || 'Uncategorized').trim()))]
    .filter(Boolean)
    .sort()
    .slice(0, 6);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElUser)}
      onClose={handleMenuClose}
    >
      {!isAuthenticated ? (
          <div>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>Login</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/signup'); }}>Sign Up</MenuItem>
          </div>
      ) : (
          <div>
            <MenuItem disabled sx={{ opacity: 1, fontWeight: 'bold', color: 'black' }}>Hello, {user?.name}</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Your Profile</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/Yourorders'); }}>Your Orders</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/support'); }}>Support History</MenuItem>
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </div>
      )}
    </Menu>
  );

  const notifId = 'notification-menu';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotifMenu = (
    <Menu
      anchorEl={anchorElNotif}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={notifId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorElNotif)}
      onClose={handleNotifClose}
      PaperProps={{
        style: { width: 320, maxHeight: 400 }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllAsRead}>Mark all read</Button>
        )}
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <MenuItem 
              key={n._id} 
              onClick={() => { navigate(n.link || '/support'); handleNotifClose(); }}
              sx={{ 
                bgcolor: n.isRead ? 'transparent' : 'action.hover',
                borderLeft: n.isRead ? 'none' : '4px solid #febd69',
                mb: 0.5,
                whiteSpace: 'normal'
              }}
            >
              <ListItemText
                primary={n.title}
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.primary">{n.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(n.date).toLocaleString()}</Typography>
                  </React.Fragment>
                }
              />
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No notifications</Typography>
          </Box>
        )}
      </List>
      {notifications.length > 0 && (
          <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Button fullWidth size="small" onClick={() => { navigate('/profile'); handleNotifClose(); }}>View All</Button>
          </Box>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: '60px !important' }}>
          {/* Mobile Menu Icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate('/')}
            sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer', fontFamily: 'Arial', fontWeight: 'bold' }}
          >
            V-CART
          </Typography>

          {/* Location (Visual Only) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', mx: 2, cursor: 'pointer' }}>
             <Typography variant="caption" sx={{ color: '#ccc', lineHeight: 1 }}>Deliver to</Typography>
             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                 <LocationOn sx={{ fontSize: 16 }} />
                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>India</Typography>
             </Box>
          </Box>

          {/* Search Bar */}
          <Search>
            <StyledInputBase
              placeholder="Search V-Cart..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
             <Box sx={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 50, bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0 4px 4px 0', cursor: 'pointer' }} onClick={handleSearch}>
                <SearchIcon sx={{ color: 'white' }} />
             </Box>
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
                onClick={handleProfileMenuOpen}
                sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', cursor: 'pointer', '&:hover': { opacity: 0.8 }, p: 1, color: 'white' }}
            >
                 <Typography variant="caption" sx={{ lineHeight: 1, color: 'grey.300' }}>Hello, {isAuthenticated ? user?.name : 'Sign in'}</Typography>
                 <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    Account & Lists <ArrowDropDown fontSize="small" />
                 </Typography>
            </Box>

            <Box 
                onClick={() => navigate(isAuthenticated ? '/Yourorders' : '/login')}
                sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', cursor: 'pointer', '&:hover': { opacity: 0.8 }, p: 1, color: 'white' }}
            >
                 <Typography variant="caption" sx={{ lineHeight: 1, color: 'grey.300' }}>Returns</Typography>
                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>& Orders</Typography>
            </Box>

            {isAuthenticated && (
              <IconButton color="inherit" onClick={handleNotifOpen}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            )}

            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              onClick={() => navigate('/cart')}
            >
              <Badge badgeContent={cartItems?.length || 0} color="secondary">
                <ShoppingCartIcon fontSize="large" sx={{ color: 'white' }} />
              </Badge>
              <Typography variant="caption" sx={{ mt: 2, fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}>Cart</Typography>
            </IconButton>
          </Box>
        </Toolbar>
        
        {/* Secondary Navbar (Categories) */}
        <Box sx={{ bgcolor: 'primary.light', color: 'white', px: 2, py: 1, display: 'flex', gap: 2, overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button startIcon={<MenuIcon />} sx={{ color: 'white', textTransform: 'none', fontWeight: 'bold' }}>All</Button>
            {categories.map((cat) => (
                <Button 
                    key={cat} 
                    sx={{ color: 'white', textTransform: 'none', whiteSpace: 'nowrap' }} 
                    onClick={() => navigate(`/products?keyword=${encodeURIComponent(cat)}`)}
                >
                    {cat}
                </Button>
            ))}
            <Button sx={{ color: 'white', textTransform: 'none', whiteSpace: 'nowrap' }} onClick={() => navigate('/products')}>See All Deals</Button>
        </Box>
      </AppBar>
      {renderMenu}
      {renderNotifMenu}
      <CreateTicket open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)} />
    </Box>
  );
};

export default Navbar;
