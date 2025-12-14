import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CreateTicket from '../Support/CreateTicket';
import { HelpOutline, Logout } from '@mui/icons-material';
import { useState } from "react";


const pages = ["Home", "Products"];
const settings = ["Profile", "Logout"];

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [clickedPage, setClickedpage] = React.useState("");


  // React.useEffect(() => {
  //   const CartItemsFromStorage = JSON.parse(localStorage.getItem("VJ_cart"));
  //   setCartItem(CartItemsFromStorage)
  //  }, [])
   

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navi = useNavigate();

  const handlelinkclick = (page) => {
    console.log(page);
    setClickedpage(page);
    if (page === "Products") {
      navi("/products");
    } else if (page === "Home") {
      navi("/");
    }
  };

  const handlesettingClick = (setting) => {
    if (setting === "Admin") {
      navi("/addproduct");
    } else if (setting === "Profile") {
      navi("/profile");
    } else if (setting === "Logout") {
      logout();
      navi("/login");
    }
  };

  const handlecartnavigate = () => {
    navi("/cart");
    //  window.location.reload();
  };

  return (
    <Box>
      <AppBar position="static" sx={{ background: "#1C448E" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <StorefrontIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              V-CART
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setTicketDialogOpen(true)}
                title="Support"
              >
                <HelpOutline />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              V-CART
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page, index) => (
                <Button
                  key={page}
                  onClick={() => handlelinkclick(page)}
                  sx={{
                    my: 2,
                    display: "block",
                    color: clickedPage === page ? "#1C448E" : "white",
                    background: clickedPage === page ? "#fff" : "transparent",
                    ":hover": {
                      bgcolor: "#4c4cff",
                      color: "white",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mr: 2, alignItems: 'center' }}>
              {!isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => navigate('/login')}
                    sx={{ color: 'white', borderColor: 'white' }} 
                    variant="outlined"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/signup')}
                    sx={{ bgcolor: 'white', color: '#1976d2', '&:hover': { bgcolor: '#f5f5f5' } }} 
                    variant="contained"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" color="inherit" sx={{ mr: 1, fontWeight: 'bold' }}>
                    Hello, {user?.name || 'User'}
                  </Typography>
                  <Tooltip title="Logout">
                    <IconButton 
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }} 
                      sx={{ color: 'white' }}
                    >
                      <Logout />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Box sx={{ flexGrow: 0, display: "flex", gap: "20px" }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, display: "flex", gap: "20px" }}
                >
                  <AccountCircleIcon
                    sx={{ fontSize: "40px", color: "#ffff" }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="cart">
                <ShoppingCartIcon
                  sx={{ fontSize: "40px", color: "#ffff" }}
                  onClick={() => handlecartnavigate()}
                />
                {cartItems?.length || 0}
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handlesettingClick(setting)}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <CreateTicket open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)} />
    </Box>
  );
};

export default Navbar;
