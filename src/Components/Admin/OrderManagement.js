import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Stack,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import {
  Download,
  Payments,
  Pending,
  CheckCircle,
  TrendingUp,
  Search,
  FilterList,
  Storefront,
  Visibility,
  Print,
  MoreVert,
  Cancel,
  Person
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import Swal from 'sweetalert2';

const OrderManagement = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders.all}`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const stats = useMemo(() => {
    return {
      total: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      pending: orders.filter(o => o.status === 'Pending').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      count: orders.length
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by Tab
    if (tabValue === 1) filtered = filtered.filter(o => o.status === 'Pending' || o.status === 'Processing');
    if (tabValue === 2) filtered = filtered.filter(o => o.status === 'Shipped');
    if (tabValue === 3) filtered = filtered.filter(o => o.status === 'Delivered');
    if (tabValue === 4) filtered = filtered.filter(o => o.status === 'Cancelled');
    if (tabValue === 5) filtered = filtered.filter(o => o.status === 'Return Requested' || o.status === 'Returned' || o.status === 'Return Rejected');

    // Filter by Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(o => 
        o._id.toLowerCase().includes(lower) || 
        o.user?.name?.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [orders, tabValue, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusChip = (status) => {
    let color = 'default';
    switch(status) {
        case 'Pending': color = 'warning'; break;
        case 'Processing': color = 'info'; break;
        case 'Shipped': color = 'primary'; break;
        case 'Delivered': color = 'success'; break;
        case 'Cancelled': color = 'error'; break;
        case 'Return Requested': color = 'secondary'; break;
        case 'Returned': color = 'primary'; break;
        case 'Return Rejected': color = 'error'; break;
        default: break;
    }
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
  };

  const handleStatusUpdate = async (status) => {
      try {
          const token = localStorage.getItem('vcart_token');
          await axios.put(`${API_BASE_URL}${API_ENDPOINTS.orders.updateStatus(selectedOrder._id)}`, 
            { status },
            { headers: { 'x-auth-token': token } }
          );
          
          Swal.fire('Success', `Order marked as ${status}`, 'success');
          // Update local state
          setOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, status } : o));
          setSelectedOrder(prev => ({...prev, status}));
      } catch(err) {
          Swal.fire('Error', 'Failed to update status', 'error');
      }
  };

  const handleCancelOrder = () => {
      Swal.fire({
          title: 'Cancel Order?',
          text: 'This will cancel the order and process refund if applicable.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Cancel Order'
      }).then(async (result) => {
          if (result.isConfirmed) {
             await handleStatusUpdate('Cancelled');
          }
      });
  };

  const handleDownloadInvoice = () => {
      Swal.fire('Info', 'Invoice download feature coming soon!', 'info');
  };
  
  const handleExport = () => {
      Swal.fire('Info', 'Export to CSV coming soon!', 'info');
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
                Order Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Track and manage customer orders.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button 
                variant="outlined" 
                startIcon={<Download />} 
                onClick={handleExport}
            >
                Export
            </Button>
            <Button 
                variant="contained" 
                startIcon={<Storefront />} 
                onClick={fetchOrders}
                disabled={loading}
            >
                Refresh
            </Button>
        </Stack>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Revenue', count: formatCurrency(stats.total), icon: <Payments />, color: '#10b981' },
          { label: 'Pending Orders', count: stats.pending, icon: <Pending />, color: '#f59e0b' },
          { label: 'Completed Orders', count: stats.delivered, icon: <CheckCircle />, color: '#3b82f6' },
          { label: 'Total Orders', count: stats.count, icon: <TrendingUp />, color: '#6366f1' },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ 
                height: '100%', 
                borderLeft: `6px solid ${item.color}`,
                boxShadow: theme.shadows[1],
                bgcolor: theme.palette.background.paper
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
                    {item.count}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters and Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: theme.shadows[1] }}>
        <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="primary" 
            indicatorColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="All Orders" />
          <Tab label="Pending" />
          <Tab label="Shipped" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
          <Tab label="Returns" />
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by Order ID or Customer Name..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
          <IconButton color="primary">
            <FilterList />
          </IconButton>
        </Box>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2, borderColor: theme.palette.divider, bgcolor: theme.palette.background.paper }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" sx={{ mt: 1 }}>Loading orders...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">No orders found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
                filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.text.primary}>#{order._id.substring(order._id.length - 8).toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem', bgcolor: 'primary.light' }}>
                            {order.user?.name?.charAt(0) || <Person fontSize="small" />}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="medium">
                                {order.user?.name || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={theme.palette.text.primary}>
                        {new Date(order.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(order.date).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.text.primary}>
                        {formatCurrency(order.total)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {order.items?.length || 0} items
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton color="primary" onClick={() => { setSelectedOrder(order); setOpenDetailDialog(true); }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Invoice">
                        <IconButton onClick={handleDownloadInvoice}>
                            <Print />
                        </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color={theme.palette.text.primary}>Order Details</Typography>
            <Typography variant="caption" color="text.secondary">#{selectedOrder?._id}</Typography>
          </Box>
          <Box>
              <Button startIcon={<Print />} onClick={handleDownloadInvoice} sx={{ mr: 1 }}>Invoice</Button>
              <IconButton onClick={() => setOpenDetailDialog(false)}><Cancel /></IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* Items List */}
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Order Items</Typography>
                    <Stack spacing={2}>
                        {selectedOrder.items?.map((item, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                                <Avatar variant="square" src={item.image} sx={{ width: 60, height: 60 }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold">{item.productname}</Typography>
                                    <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="subtitle2" fontWeight="bold">{formatCurrency(item.price * item.quantity)}</Typography>
                                    <Typography variant="caption" color="text.secondary">{formatCurrency(item.price)} each</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                    
                    {/* Totals */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 2 }}>
                         <Stack spacing={1}>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <Typography variant="body2">Subtotal</Typography>
                                 <Typography variant="body2" fontWeight="bold">{formatCurrency(selectedOrder.total)}</Typography>
                             </Box>
                             <Divider />
                             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                                 <Typography variant="h6" fontWeight="bold" color="primary.main">{formatCurrency(selectedOrder.total)}</Typography>
                             </Box>
                         </Stack>
                    </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Customer Details</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Name</Typography>
                                <Typography variant="body1">{selectedOrder.user?.name}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body1">{selectedOrder.user?.email}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Shipping Address</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedOrder.address ? (
                                    <>
                                    {selectedOrder.address.street}<br/>
                                    {selectedOrder.address.city}, {selectedOrder.address.state}<br/>
                                    {selectedOrder.address.zipCode}<br/>
                                    {selectedOrder.address.country}
                                    </>
                                ) : "N/A"}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Update Status</Typography>
                        <FormControl fullWidth size="small">
                            <InputLabel>Order Status</InputLabel>
                            <Select
                                value={selectedOrder.status}
                                label="Order Status"
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Processing">Processing</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Return Requested">Return Requested</MenuItem>
                                <MenuItem value="Returned">Returned</MenuItem>
                                <MenuItem value="Return Rejected">Return Rejected</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Box sx={{ mt: 2 }}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                color="error" 
                                onClick={handleCancelOrder}
                                disabled={selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Delivered'}
                            >
                                Cancel Order
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
