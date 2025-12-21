import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import io from 'socket.io-client';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
        const token = localStorage.getItem('vcart_token');
        if (!token) return;

        const params = new URLSearchParams();
        if (statusFilter !== 'All') params.append('status', statusFilter);
        if (searchQuery) params.append('search', searchQuery);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);

        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders.all}?${params.toString()}`, {
            headers: { 'x-auth-token': token }
        });
        setOrders(res.data);
    } catch (err) {
        console.error("Failed to load orders", err);
    }
  }, [statusFilter, searchQuery, dateFrom, dateTo]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on('newOrder', (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      // Optional: Toast notification
    });

    socket.on('orderUpdated', (updatedOrder) => {
      setOrders((prevOrders) => 
        prevOrders.map(order => order._id === updatedOrder._id ? updatedOrder : order)
      );
    });

    socket.on('orderCancelled', ({ orderId, status }) => {
        setOrders((prevOrders) => 
          prevOrders.map(order => order._id === orderId ? { ...order, status } : order)
        );
    });

    return () => socket.disconnect();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
        const token = localStorage.getItem('vcart_token');
        await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status: newStatus }, {
            headers: { 'x-auth-token': token }
        });

        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        Swal.fire('Updated!', `Order status changed to ${newStatus}`, 'success');
    } catch (err) {
        Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'warning',
      'Shipped': 'info',
      'Delivered': 'success',
      'Cancelled': 'error',
      'Returned': 'default'
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" className="mb-4">
        Order Management
      </Typography>
      <Typography variant="subtitle1" className="mb-3 text-muted">
        Total Orders: {orders.length}
      </Typography>

      {/* Filters */}
      <Card className="mb-3">
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <MenuItem value="All">All Orders</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Returned">Returned</MenuItem>
                </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
                <TextField
                fullWidth
                label="Search by Order ID or Product"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Grid>

            <Grid item xs={12} md={3}>
                <TextField
                fullWidth
                label="From Date"
                type="date"
                variant="outlined"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid item xs={12} md={3}>
                <TextField
                fullWidth
                label="To Date"
                type="date"
                variant="outlined"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Items</strong></TableCell>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.substring(0, 10)}...</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                            <MenuItem value="Returned">Returned</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(order)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" className="mb-2">
                Order ID: {selectedOrder._id}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-3">
                Date: {new Date(selectedOrder.date).toLocaleString()}
              </Typography>
              
              <Typography variant="subtitle1" className="mb-2"><strong>User:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</Typography>
              
              <Typography variant="subtitle1" className="mb-2"><strong>Items:</strong></Typography>
              {selectedOrder.items.map((item, idx) => (
                <Box key={idx} className="mb-2 p-2" sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                  <Typography variant="body1">{item.productname}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity} | Price: ₹{item.price}
                  </Typography>
                </Box>
              ))}
              
              <Box className="mt-3">
                <Typography variant="h6">
                  Total: ₹{selectedOrder.total}
                </Typography>
                <Chip 
                  label={selectedOrder.status} 
                  color={getStatusColor(selectedOrder.status)}
                  className="mt-2"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
