import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import { ShoppingBag, LocalOffer } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, isBuyNow } = location.state || { items: [], isBuyNow: false };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + Number(item.price), 0);
  const total = subtotal - discount;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    
    // Get coupons from localStorage
    const coupons = JSON.parse(localStorage.getItem('vcart_coupons') || '[]');
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase() && c.active);
    
    if (!coupon) {
      setCouponError('Invalid or expired coupon code');
      return;
    }
    
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      setCouponError(`Minimum purchase of $${coupon.minPurchase} required`);
      return;
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'Percentage') {
      discountAmount = (subtotal * coupon.discount) / 100;
    } else {
      discountAmount = coupon.discount;
    }
    
    setDiscount(discountAmount);
    Swal.fire('Success!', `Coupon applied! You saved $${discountAmount.toFixed(2)}`, 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
          items: items.map(i => ({
              productname: i.productname,
              price: i.price,
              ImageURL: i.ImageURL,
              productId: i._id,
              quantity: 1 
          })),
          total: total,
          shippingInfo: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              zipCode: formData.zipCode
          }
      };

      const token = localStorage.getItem('vcart_token');
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.orders.place}`, orderData, {
          headers: { 'x-auth-token': token }
      });
      
      Swal.fire({
        title: 'Order Placed Successfully!',
        html: `
          <p>Thank you, <strong>${formData.name}</strong>!</p>
          <p>Your order of <strong>$${total}</strong> has been confirmed.</p>
          <p>We'll deliver to: ${formData.address}, ${formData.city}</p>
        `,
        icon: 'success',
        confirmButtonText: 'View Orders'
      }).then(() => {
        navigate('/Yourorders');
      });
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire('Error', 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <Typography variant="h5">No items to checkout</Typography>
        <Button variant="contained" onClick={() => navigate('/products')} className="mt-3">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="mt-4 mb-5">
      <Typography variant="h4" className="mb-4 text-center">
        <ShoppingBag /> Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">Order Summary</Typography>
              {items.map((item, idx) => (
                <Box key={idx} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <div>
                    <Typography variant="body1">{item.productname}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price}
                    </Typography>
                  </div>
                  <img 
                    src={item.ImageURL} 
                    alt={item.productname} 
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                  />
                </Box>
              ))}
              <Box className="mt-3 pt-3 border-top">
                <Typography variant="body1" className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </Typography>
                {discount > 0 && (
                  <Typography variant="body1" className="d-flex justify-content-between mb-2" color="success.main">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </Typography>
                )}
                <Typography variant="h6" className="d-flex justify-content-between">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Shipping Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">Shipping Information</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={2}
                  required
                />
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="City *"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                {/* Coupon Code Section */}
                <Box className="mt-3">
                  <Typography variant="subtitle2" className="mb-2">
                    <LocalOffer fontSize="small" /> Have a coupon code?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      label="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="SAVE20"
                    />
                    <Button variant="outlined" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </Box>
                  {couponError && <Alert severity="error" className="mt-2">{couponError}</Alert>}
                  {discount > 0 && <Alert severity="success" className="mt-2">Coupon applied! You saved ${discount.toFixed(2)}</Alert>}
                </Box>

                <Box className="mt-4 d-flex gap-2 justify-content-end">
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : `Place Order - $${total}`}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
