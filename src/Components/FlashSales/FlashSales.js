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
  Chip
} from '@mui/material';
import { LocalOffer, Timer } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const FlashSales = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown

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
    discount: 20
  }));

  if (flashSaleProducts.length === 0) return null;

  return (
    <Container sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalOffer sx={{ fontSize: 40, color: 'error.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Flash Sales
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timer sx={{ color: 'error.main' }} />
          <Typography variant="h6" color="error.main" fontWeight="bold">
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {flashSaleProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <Card sx={{ position: 'relative', height: '100%' }}>
              <Chip
                label={`-${product.discount}%`}
                color="error"
                size="small"
                sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }}
              />
              <CardMedia
                component="img"
                height="200"
                image={product.ImageURL}
                alt={product.productname}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {product.productname}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="h6" color="error.main" fontWeight="bold">
                    ${product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ${product.originalPrice}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/products')}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FlashSales;
