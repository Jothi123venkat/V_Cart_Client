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
import { HelpOutline, Logout, ArrowDropDown, LocationOn } from '@mui/icons-material';
import { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import StorefrontIcon from "@mui/icons-material/Storefront";

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
            <MenuItem onClick={() => { handleMenuClose(); navigate('/support'); }}>Support Chat</MenuItem>
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </div>
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
      <CreateTicket open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)} />
    </Box>
  );
};

export default Navbar;
