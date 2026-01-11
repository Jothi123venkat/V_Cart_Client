import * as React from "react";
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge,
  MenuItem, Menu, Button, Tooltip, Divider, List, ListItemText,
  Drawer, useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon, Search as SearchIcon, ShoppingCart as ShoppingCartIcon,
  Person, Notifications, FavoriteBorder, Close, ArrowDropDown
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { useState, useEffect } from "react";
import axios from 'axios';
import io from 'socket.io-client';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import ThemeToggle from '../Shared/ThemeToggle';
import CreateTicket from '../Support/CreateTicket';

// Modern Search Bar with Glassmorphism
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'light' 
    ? alpha(theme.palette.common.white, 0.95)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: theme.palette.mode === 'light'
      ? '0 4px 20px rgba(99, 102, 241, 0.15)'
      : '0 4px 20px rgba(129, 140, 248, 0.25)',
    borderColor: theme.palette.primary.main,
  },
  '&:focus-within': {
    boxShadow: theme.palette.mode === 'light'
      ? '0 4px 20px rgba(99, 102, 241, 0.2)'
      : '0 4px 20px rgba(129, 140, 248, 0.3)',
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    flexGrow: 1,
    maxWidth: 600,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  cursor: 'pointer',
  width: 50,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 7, 1.5, 2),
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.95rem',
    '&::placeholder': {
      opacity: 0.7,
    },
  },
}));

// Styled Menu Icon Button
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { products } = useProducts();
  const { siteConfig } = useSiteConfig();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  const handleProfileMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleNotifOpen = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const categories = [...new Set(products.map(p => (p.category || 'Uncategorized').trim()))]
    .filter(Boolean)
    .sort()
    .slice(0, 6);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // User Menu
  const renderUserMenu = (
    <Menu
      anchorEl={anchorElUser}
      open={Boolean(anchorElUser)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: {
          mt: 1.5,
          borderRadius: 2,
          minWidth: 200,
          boxShadow: theme.palette.mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
            : '0 8px 32px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      {!isAuthenticated ? (
        <div>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>
            <Typography>Login</Typography>
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/signup'); }}>
            <Typography>Sign Up</Typography>
          </MenuItem>
        </div>
      ) : (
        <div>
          <MenuItem disabled sx={{ opacity: 1, fontWeight: 'bold' }}>
            Hello, {user?.name}
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
            Your Profile
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/Yourorders'); }}>
            Your Orders
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/support'); }}>
            Support History
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            Sign Out
          </MenuItem>
        </div>
      )}
    </Menu>
  );

  // Notifications Menu
  const renderNotifMenu = (
    <Menu
      anchorEl={anchorElNotif}
      open={Boolean(anchorElNotif)}
      onClose={handleNotifClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: {
          mt: 1.5,
          borderRadius: 2,
          width: 360,
          maxHeight: 480,
          boxShadow: theme.palette.mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
            : '0 8px 32px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Notifications</Typography>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllAsRead}>Mark all read</Button>
        )}
      </Box>
      <Divider />
      <List sx={{ p: 0, maxHeight: 360, overflow: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <MenuItem
              key={n._id}
              onClick={() => { navigate(n.link || '/support'); handleNotifClose(); }}
              sx={{
                bgcolor: n.isRead ? 'transparent' : alpha(theme.palette.primary.main, 0.08),
                borderLeft: n.isRead ? 'none' : `4px solid ${theme.palette.primary.main}`,
                mb: 0.5,
                whiteSpace: 'normal',
                py: 1.5,
              }}
            >
              <ListItemText
                primary={n.title}
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.primary">{n.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(n.date).toLocaleString()}
                    </Typography>
                  </React.Fragment>
                }
              />
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No notifications</Typography>
          </Box>
        )}
      </List>
      {notifications.length > 0 && (
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Button fullWidth size="small" onClick={() => { navigate('/profile'); handleNotifClose(); }}>
            View All
          </Button>
        </Box>
      )}
    </Menu>
  );

  // Mobile Drawer
  const renderMobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Menu</Typography>
        <IconButton onClick={() => setMobileDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ p: 2 }}>
        <MenuItem onClick={() => { navigate('/'); setMobileDrawerOpen(false); }}>
          Home
        </MenuItem>
        <MenuItem onClick={() => { navigate('/products'); setMobileDrawerOpen(false); }}>
          All Products
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem
            key={cat}
            onClick={() => { navigate(`/products?category=${encodeURIComponent(cat)}`); setMobileDrawerOpen(false); }}
          >
            {cat}
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <>
            <MenuItem onClick={() => { navigate('/profile'); setMobileDrawerOpen(false); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/Yourorders'); setMobileDrawerOpen(false); }}>
              Orders
            </MenuItem>
            <MenuItem onClick={() => { navigate('/support'); setMobileDrawerOpen(false); }}>
              Support
            </MenuItem>
            <MenuItem onClick={() => { handleLogout(); setMobileDrawerOpen(false); }} sx={{ color: 'error.main' }}>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { navigate('/login'); setMobileDrawerOpen(false); }}>
              Login
            </MenuItem>
            <MenuItem onClick={() => { navigate('/signup'); setMobileDrawerOpen(false); }}>
              Sign Up
            </MenuItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          backgroundColor: theme.palette.mode === 'light'
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.default, 0.9),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 3 } }}>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box 
            onClick={() => navigate('/')}
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mr: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            {siteConfig?.logoUrl && (
                <Box
                    component="img"
                    src={siteConfig.logoUrl}
                    alt="Logo"
                    sx={{ 
                        height: 32, 
                        mr: 1.5,
                        display: { xs: 'none', sm: 'block' }
                    }}
                />
            )}
            <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{
                display: { xs: 'none', sm: 'block' },
                fontFamily: 'Poppins',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                }}
            >
                {siteConfig?.brandName || 'V-CART'}
            </Typography>
            <ShoppingCartIcon 
                sx={{ 
                    ml: 1, 
                    display: { xs: 'none', sm: 'block' },
                    fontSize: 28,
                    color: theme.palette.primary.main
                }} 
            />
          </Box>

          {/* Search Bar */}
          <Search>
            <StyledInputBase
              placeholder="Search for products..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon />
            </SearchIconWrapper>
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            {isAuthenticated && (
              <Tooltip title="Wishlist">
                <StyledIconButton color="inherit" onClick={() => navigate('/profile?tab=wishlist')}>
                  <FavoriteBorder />
                </StyledIconButton>
              </Tooltip>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Tooltip title="Notifications">
                <StyledIconButton color="inherit" onClick={handleNotifOpen}>
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                  </Badge>
                </StyledIconButton>
              </Tooltip>
            )}

            {/* Cart */}
            <Tooltip title="Cart">
              <StyledIconButton color="inherit" onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartItems?.length || 0} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </StyledIconButton>
            </Tooltip>

            {/* User Account */}
            <Tooltip title="Account">
              <StyledIconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Person />
              </StyledIconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {/* Category Bar - Desktop Only */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            px: 3,
            py: 1,
            overflowX: 'auto',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.primary.main,
              borderRadius: 2,
            },
          }}
        >
          <Button
            size="small"
            onClick={() => navigate('/products')}
            sx={{
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              },
            }}
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="small"
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>
      </AppBar>

      {renderUserMenu}
      {renderNotifMenu}
      {renderMobileDrawer}
      <CreateTicket open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)} />
    </Box>
  );
};

export default Navbar;
