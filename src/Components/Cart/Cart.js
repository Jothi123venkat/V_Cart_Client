import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Divider,
  Stack,
  LinearProgress,
  Tooltip,
  Paper,
  Container,
  InputAdornment,
  Collapse,
  useMediaQuery,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add,
  Remove,
  DeleteOutline,
  ShoppingBag,
  LocalShipping,
  VerifiedUser,
  ArrowForward,
  Discount,
  Lock
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Constants
const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 50; // Standard shipping

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItem, loading } = useCart(); 
  const { isAuthenticated } = useAuth();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Derived State
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product?.price || 0) * item.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% mock discount
  const total = subtotal + shipping - discount;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Handlers
  const handleQuantityChange = async (item, change) => {
    const newQuantity = item.quantity + change;

    // Check bounds
    if (newQuantity < 1) {
        // Option: Remove item or specific removal confirm? 
        // Let's just remove if it goes to 0 (handled by updateCartItem or explicit remove)
        removeFromCart(item.product._id);
        return;
    }

    // Check stock limit
    if (item.product.stock !== undefined && newQuantity > item.product.stock) {
        // Toast is handled in Context usually, or we can alert here
        alert(`Only ${item.product.stock} items available in stock`);
        return;
    }

    // Call update context function
    if (updateCartItem) {
        await updateCartItem(item.product._id, newQuantity);
    } else {
        console.error("updateCartItem function missing from context");
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    } else {
      alert('Invalid code (Try: WELCOME10)');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
        navigate('/login', { state: { from: '/cart' }});
        return;
    }
    navigate('/checkout', { state: { items: cartItems, total, isBuyNow: false } });
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
            <ShoppingBag sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3, opacity: 0.5 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Looks like you haven't added anything to your cart yet.
            </Typography>
            <Button 
                variant="contained" 
                size="large"
                startIcon={<ArrowForward />}
                onClick={() => navigate('/products')}
                sx={{ 
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    boxShadow: theme.shadows[4]
                }}
            >
                Start Shopping
            </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 4, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Your Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items List */}
        <Grid item xs={12} md={8}>
            {/* Free Shipping Progress */}
            <Card sx={{ mb: 3, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.2)}` }} elevation={0}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalShipping color="success" />
                    <Box sx={{ flexGrow: 1 }}>
                         <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ mb: 0.5 }}>
                            {isFreeShipping ? 'You have unlocked FREE Shipping!' : `Add ₹${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for Free Shipping`}
                         </Typography>
                         <LinearProgress 
                            variant="determinate" 
                            value={progressToFreeShipping} 
                            color="success" 
                            sx={{ height: 6, borderRadius: 3 }} 
                        />
                    </Box>
                </CardContent>
            </Card>

            <Stack spacing={2}>
                {cartItems.map((item) => (
                    <Card 
                        key={item.product?._id}
                        elevation={0}
                        sx={{ 
                            display: 'flex', 
                            p: 2, 
                            borderRadius: 3, 
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.2s',
                            '&:hover': {
                                boxShadow: theme.shadows[2],
                                borderColor: theme.palette.primary.main
                            }
                        }}
                    >
                        <CardMedia
                            component="img"
                            sx={{ width: 120, height: 120, borderRadius: 2, objectFit: 'cover' }}
                            image={item.product?.ImageURL || 'https://via.placeholder.com/150'}
                            alt={item.product?.productname}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 3, justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.product?.productname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.product?.productdescription?.substring(0, 60)}...
                                    </Typography>
                                </Box>
                                <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => removeFromCart(item.product?._id)}
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </Box>
                            
                            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: theme.palette.action.hover, borderRadius: 2, p: 0.5 }}>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleQuantityChange(item, -1)}
                                        disabled={loading || item.quantity <= 1}
                                    >
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 20, textAlign: 'center' }}>
                                        {item.quantity}
                                    </Typography>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleQuantityChange(item, 1)}
                                        disabled={loading || (item.product.stock !== undefined && item.quantity >= item.product.stock)}
                                    >
                                        <Add fontSize="small" />
                                    </IconButton>
                                 </Stack>
                                 <Typography variant="h6" color="primary.main" fontWeight="bold">
                                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                                 </Typography>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Stack>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
            <Paper 
                elevation={3}
                sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    position: 'sticky', 
                    top: 100,
                    bgcolor: theme.palette.background.paper
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order Summary
                </Typography>
                
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography fontWeight="bold">₹{subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography color={isFreeShipping ? 'success.main' : 'text.primary'}>
                            {isFreeShipping ? 'FREE' : `₹${shipping.toFixed(2)}`}
                        </Typography>
                    </Box>
                    {promoApplied && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="success.main">Discount (10%)</Typography>
                            <Typography color="success.main">-₹{discount.toFixed(2)}</Typography>
                        </Box>
                    )}
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h5" fontWeight="800" color="primary.main">₹{total.toFixed(2)}</Typography>
                    </Box>
                </Stack>

                {/* Promo Code */}
                 <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Promo Code"
                        fullWidth
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Discount fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button 
                        variant="outlined" 
                        onClick={handleApplyPromo}
                        disabled={!promoCode || promoApplied}
                    >
                        Apply
                    </Button>
                </Box>

                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    onClick={handleCheckout}
                    disabled={loading}
                    sx={{ 
                        py: 1.5, 
                        fontWeight: 'bold', 
                        fontSize: '1rem',
                        boxShadow: theme.shadows[4],
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` 
                    }}
                >
                    Checkout Now
                </Button>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 3, opacity: 0.7 }}>
                    <Lock fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                        Secure SSL Encrypted Checkout
                    </Typography>
                </Stack>
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
