import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Avatar
} from '@mui/material';
import { Add, LocalOffer, Delete, CheckCircle, Cancel, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import io from 'socket.io-client';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discount: '',
    type: 'Percentage',
    expiryDate: '',
    minPurchase: 0,
    usageLimit: ''
  });

  useEffect(() => {
    fetchPromotions();

    const socket = io(API_BASE_URL);

    socket.on('newCoupon', (coupon) => {
      setPromotions(prev => [coupon, ...prev]);
    });

    socket.on('couponUpdated', (updatedCoupon) => {
      setPromotions(prev => prev.map(c => c._id === updatedCoupon._id ? updatedCoupon : c));
    });

    socket.on('couponDeleted', (couponId) => {
      setPromotions(prev => prev.filter(c => c._id !== couponId));
    });

    return () => socket.disconnect();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.coupons.base}`, {
        headers: { 'x-auth-token': token }
      });
      setPromotions(res.data);
    } catch (err) {
      console.error("Failed to fetch promotions", err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPromo({ code: '', discount: '', type: 'Percentage', expiryDate: '', minPurchase: 0, usageLimit: '' });
  };

  const handleCreate = async () => {
    if (!newPromo.code || !newPromo.discount) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('vcart_token');
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.coupons.base}`, newPromo, {
        headers: { 'x-auth-token': token }
      });
      Swal.fire('Success!', 'Promotion created successfully', 'success');
      handleClose();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to create promotion', 'error');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.coupons.base}/${id}`, { active: !currentStatus }, {
        headers: { 'x-auth-token': token }
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Coupon?',
      text: "Users won't be able to use this code anymore.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('vcart_token');
        await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.coupons.base}/${id}`, {
          headers: { 'x-auth-token': token }
        });
        Swal.fire('Deleted!', 'Promotion has been removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete promotion', 'error');
      }
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Promotions & Discounts
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Manage your marketing campaigns and checkout coupons in real-time.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={handleOpen}
            sx={{ borderRadius: 2, px: 3 }}
        >
            Create Coupon
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell><strong>Coupon Details</strong></TableCell>
                  <TableCell><strong>Discount</strong></TableCell>
                  <TableCell><strong>Usage / Limit</strong></TableCell>
                  <TableCell><strong>Min. Purchase</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.length > 0 ? promotions.map((promo) => (
                  <TableRow key={promo._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                            <LocalOffer fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{promo.code}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Exp: {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString() : 'Never'}
                            </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={promo.type === 'Percentage' ? `${promo.discount}% OFF` : `₹${promo.discount} OFF`} 
                            color="secondary" 
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                        />
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2">
                            {promo.usedCount || 0} / {promo.usageLimit || '∞'}
                        </Typography>
                    </TableCell>
                    <TableCell>₹{promo.minPurchase || 0}</TableCell>
                    <TableCell>
                      <Chip 
                        label={promo.active ? 'Active' : 'Inactive'} 
                        icon={promo.active ? <CheckCircle /> : <Cancel />}
                        color={promo.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title={promo.active ? "Deactivate" : "Activate"}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => toggleActive(promo._id, promo.active)}
                                    color={promo.active ? "warning" : "success"}
                                >
                                    {promo.active ? <Cancel fontSize="small" /> : <CheckCircle fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDelete(promo._id)} color="error">
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No active promotions found.</Typography>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Create New Promotion</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Configure a new coupon code for your customers.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={newPromo.code}
                onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                placeholder="PROMO2025"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={newPromo.discount}
                onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={newPromo.type}
                onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amt (₹)</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={newPromo.expiryDate}
                    onChange={(e) => setNewPromo({ ...newPromo, expiryDate: e.target.value })}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Min Purchase"
                    type="number"
                    value={newPromo.minPurchase}
                    onChange={(e) => setNewPromo({ ...newPromo, minPurchase: e.target.value })}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Usage Limit"
                    type="number"
                    value={newPromo.usageLimit}
                    onChange={(e) => setNewPromo({ ...newPromo, usageLimit: e.target.value })}
                />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ px: 4 }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManagement;
