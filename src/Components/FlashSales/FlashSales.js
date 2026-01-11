import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material';
import { LocalOffer, Timer, FlashOn, ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const FlashSales = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { products } = useProducts();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown
  const isLight = theme.palette.mode === 'light';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Get flash sale products (first 4 products with 20% discount for demo)
  const flashSaleProducts = products.slice(0, 4).map(p => ({
    ...p,
    originalPrice: p.price,
    price: (p.price * 0.8).toFixed(2),
    discount: 20,
    soldPercentage: Math.floor(Math.random() * 40) + 40 // 40-80% sold
  }));

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    navigate('/checkout', { state: { items: [{ product, quantity: 1 }], isBuyNow: true } });
  };

  if (flashSaleProducts.length === 0) return null;

  return (
    <Box
      sx={{
        py: 8,
        background: isLight
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: alpha('#ffffff', 0.05),
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: alpha('#ffffff', 0.05),
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FlashOn sx={{ fontSize: 32, color: '#FFD700' }} />
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 800,
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Don't Miss Out!
            </Typography>
            <FlashOn sx={{ fontSize: 32, color: '#FFD700' }} />
          </Box>
          
          <Typography
            variant="h6"
            sx={{
              color: alpha('#ffffff', 0.9),
              mb: 3,
              fontWeight: 400,
            }}
          >
            Limited time offers - Grab them before they're gone!
          </Typography>

          {/* Countdown Timer */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              px: 4,
              py: 2,
              borderRadius: 3,
              backgroundColor: alpha('#000000', 0.3),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
            }}
          >
            <Timer sx={{ color: '#FFD700', fontSize: 28 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: 2,
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {flashSaleProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                sx={{
                  position: 'relative',
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: isLight
                      ? '0 20px 40px rgba(0,0,0,0.2)'
                      : '0 20px 40px rgba(0,0,0,0.6)',
                    '& .product-image': {
                      transform: 'scale(1.1)',
                    },
                    '& .action-overlay': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Discount Badge */}
                <Chip
                  icon={<LocalOffer sx={{ fontSize: 16 }} />}
                  label={`${product.discount}% OFF`}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 3,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)',
                  }}
                />

                {/* Product Image */}
                <Box sx={{ position: 'relative', overflow: 'hidden', pt: '100%', bgcolor: isLight ? '#f5f5f5' : '#2a2a2a' }}>
                  <CardMedia
                    component="img"
                    image={product.ImageURL}
                    alt={product.productname}
                    className="product-image"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      p: 2,
                      transition: 'transform 0.4s ease',
                    }}
                  />

                  {/* Action Overlay */}
                  <Box
                    className="action-overlay"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      p: 2,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      transform: 'translateY(100%)',
                      opacity: 0,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                        },
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={<FlashOn />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNow(product);
                      }}
                      disabled={product.stock === 0}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Buy
                    </Button>
                  </Box>
                </Box>

                {/* Product Info */}
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    sx={{
                      fontFamily: 'Poppins',
                      fontSize: '1rem',
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {product.productname}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
                    <Typography variant="h6" color="secondary.main" fontWeight="bold">
                      ₹{product.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      ₹{product.originalPrice}
                    </Typography>
                  </Box>

                  {/* Stock Progress */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Sold: {product.soldPercentage}%
                      </Typography>
                      <Typography variant="caption" color="error.main" fontWeight="600">
                        Hurry!
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={product.soldPercentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FlashSales;
