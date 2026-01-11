import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Card, CardContent, TextField, Button, Typography, Grid, Box,
  CircularProgress, Alert, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Radio, RadioGroup, FormControlLabel, Divider, Chip
} from '@mui/material';
import { ShoppingBag, LocalOffer, CheckCircle, Home, Work, LocationOn, Star, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import toast from '../../utils/toast';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, isBuyNow } = location.state || { items: [], isBuyNow: false };

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Normalize items
  const normalizedItems = items.map(item => {
      if (item.product && item.quantity) {
          return { ...item.product, quantity: item.quantity, _id: item.product._id };
      }
      return { ...item, quantity: item.quantity || 1 };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const total = subtotal - discount;

  // Fetch saved addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.user.profile}`, {
        headers: { 'x-auth-token': token }
      });
      
      const userAddresses = res.data.addresses || [];
      setSavedAddresses(userAddresses);
      
      // Auto-select default address
      const defaultAddr = userAddresses.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        prefillFormWithAddress(defaultAddr, res.data);
      } else if (userAddresses.length > 0) {
        // If no default, select first one
        setSelectedAddressId(userAddresses[0]._id);
        prefillFormWithAddress(userAddresses[0], res.data);
      }
      
      setFetchingAddresses(false);
    } catch (err) {
      console.error('Fetch addresses error:', err);
      setFetchingAddresses(false);
    }
  };

  const prefillFormWithAddress = (addr, userData) => {
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: addr.street || '',
      city: addr.city || '',
      zipCode: addr.zip || ''
    });
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    const addr = savedAddresses.find(a => a._id === addressId);
    if (addr) {
      // Update form with selected address
      setFormData(prev => ({
        ...prev,
        address: addr.street || '',
        city: addr.city || '',
        zipCode: addr.zip || ''
      }));
    }
    setAddressDialogOpen(false);
  };

  const getSelectedAddress = () => {
    return savedAddresses.find(addr => addr._id === selectedAddressId);
  };

  const getAddressIcon = (label) => {
    switch(label?.toLowerCase()) {
      case 'home': return <Home color="primary" fontSize="small" />;
      case 'office':
      case 'work': return <Work color="secondary" fontSize="small" />;
      default: return <LocationOn color="action" fontSize="small" />;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.coupons.validate}`, {
        code: couponCode,
        subtotal: subtotal
      });
      
      const { discount: discountVal, type, message } = res.data;
      
      let discountAmount = 0;
      if (type === 'Percentage') {
        discountAmount = (subtotal * discountVal) / 100;
      } else {
        discountAmount = discountVal;
      }
      
      setDiscount(discountAmount);
      toast.success(message || 'Coupon applied successfully!');
    } catch (err) {
      setDiscount(0);
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: normalizedItems.map(i => ({
          productname: i.productname,
          price: i.price,
          ImageURL: i.ImageURL,
          productId: i._id,
          quantity: i.quantity 
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
      
      toast.success('Order placed successfully!');
      setTimeout(() => navigate('/Yourorders'), 1500);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
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
        {/* Delivery Address Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Delivery Address</Typography>
                {savedAddresses.length > 0 && (
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => setAddressDialogOpen(true)}
                  >
                    Change Address
                  </Button>
                )}
              </Box>

              {fetchingAddresses ? (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              ) : savedAddresses.length === 0 ? (
                <Alert severity="info">
                  No saved addresses. Please fill in your delivery address below.
                </Alert>
              ) : (
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  {getSelectedAddress() && (
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getAddressIcon(getSelectedAddress().label)}
                        <Typography variant="subtitle1" fontWeight="bold">
                          {getSelectedAddress().label}
                        </Typography>
                        {getSelectedAddress().isDefault && (
                          <Chip label="Default" size="small" icon={<Star />} color="primary" />
                        )}
                      </Box>
                      <Typography variant="body2">{getSelectedAddress().street}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getSelectedAddress().city}, {getSelectedAddress().state} {getSelectedAddress().zip}
                      </Typography>
                    </Box>
                  )}
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">Order Summary</Typography>
              {normalizedItems.map((item, idx) => (
                <Box key={idx} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <div>
                    <Typography variant="body1">{item.productname} (x{item.quantity})</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item.price}
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
                  <span>₹{subtotal.toFixed(2)}</span>
                </Typography>
                {discount > 0 && (
                  <Typography variant="body1" className="d-flex justify-content-between mb-2" color="success.main">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </Typography>
                )}
                <Typography variant="h6" className="d-flex justify-content-between">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact & Coupon Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">Contact Information</Typography>
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

                <Divider sx={{ my: 2 }} />

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
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      label="Coupon Code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        if(discount > 0) setDiscount(0);
                      }}
                      placeholder="SAVE20"
                      InputProps={{
                        endAdornment: discount > 0 ? (
                          <InputAdornment position="end">
                            <CheckCircle color="success" />
                          </InputAdornment>
                        ) : null
                      }}
                    />
                    <Button variant="outlined" onClick={handleApplyCoupon} disabled={loading}>
                      {loading ? <CircularProgress size={20} /> : 'Apply'}
                    </Button>
                  </Box>
                  {couponError && <Alert severity="error" className="mt-2">{couponError}</Alert>}
                  {discount > 0 && <Alert severity="success" className="mt-2">Coupon applied! You saved ₹{discount.toFixed(2)}</Alert>}
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
                    {loading ? <CircularProgress size={24} /> : `Place Order - ₹${total.toFixed(2)}`}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Address Selection Dialog */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Delivery Address</DialogTitle>
        <DialogContent>
          <RadioGroup value={selectedAddressId} onChange={(e) => handleAddressChange(e.target.value)}>
            {savedAddresses.map(addr => (
              <Card 
                key={addr._id} 
                variant="outlined" 
                sx={{ mb: 2, cursor: 'pointer' }}
                onClick={() => handleAddressChange(addr._id)}
              >
                <CardContent>
                  <FormControlLabel
                    value={addr._id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getAddressIcon(addr.label)}
                          <Typography fontWeight="bold">{addr.label}</Typography>
                          {addr.isDefault && <Chip label="Default" size="small" icon={<Star />} color="primary" />}
                        </Box>
                        <Typography variant="body2">{addr.street}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {addr.city}, {addr.state} {addr.zip}
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button variant="outlined" onClick={() => navigate('/profile')}>
            Add New Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout;
