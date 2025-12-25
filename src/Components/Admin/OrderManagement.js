import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Tab,
  Tabs,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Person,
  Payments,
  CalendarToday,
  Receipt,
  Download,
  Print,
  MoreVert,
  ArrowForward,
  TrendingUp,
  Storefront
} from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Derived Stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pending = orders.filter(o => o.status === 'Processing').length;
    const shipped = orders.filter(o => o.status === 'Shipped').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    
    // Revenue today
    const today = new Date().toISOString().split('T')[0];
    const revenueToday = orders
        .filter(o => new Date(o.date).toISOString().split('T')[0] === today)
        .reduce((sum, o) => sum + (o.total || 0), 0);

    return { totalRevenue, pending, shipped, delivered, revenueToday };
  }, [orders]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders.all}`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error", err);
      Swal.fire('Error', 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { 'x-auth-token': token }
      });
      
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Order moved to ${newStatus}`,
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err) {
      console.error("Status update error", err);
      Swal.fire('Error', 'Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMap = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (tabValue === 0) return matchesSearch;
    return matchesSearch && order.status === statusMap[tabValue];
  });

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: "This will refund items to stock. Action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('vcart_token');
        await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: { 'x-auth-token': token }
        });

        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' }));
        }

        Swal.fire('Cancelled', 'Order has been cancelled successfully', 'success');
      } catch (err) {
        console.error("Cancel error", err);
        Swal.fire('Error', 'Failed to cancel order', 'error');
      }
    }
  };

  const handleExport = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Items', 'Total', 'Status'];
    const csvData = orders.map(o => [
      o._id,
      new Date(o.date).toLocaleDateString(),
      o.user?.name || o.shippingInfo?.name || 'Guest',
      o.user?.email || o.shippingInfo?.email || 'N/A',
      o.items.length,
      o.total,
      o.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDownloadInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.productname}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1976d2; }
            .invoice-info { text-align: right; }
            .details { margin-top: 40px; display: flex; justify-content: space-between; }
            .address { line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            th { background: #f8f9fa; text-align: left; padding: 12px; border-bottom: 2px solid #eee; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .totals { margin-top: 40px; text-align: right; }
            .totals div { margin-bottom: 10px; font-size: 18px; }
            .grand-total { font-weight: bold; color: #1976d2; font-size: 24px !important; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer; background: #1976d2; color: white; border: none; border-radius: 4px;">Print Invoice</button>
          </div>
          <div class="header">
            <div class="logo">V-CART</div>
            <div class="invoice-info">
              <div style="font-size: 20px; font-weight: bold;">INVOICE</div>
              <div style="margin-top: 5px;">Order ID: #${order._id.toUpperCase()}</div>
              <div>Date: ${new Date(order.date).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="details">
            <div class="address">
              <strong>Billing/Shipping To:</strong><br>
              ${order.shippingInfo?.name || order.user?.name}<br>
              ${order.shippingInfo?.address}<br>
              ${order.shippingInfo?.city}, ${order.shippingInfo?.zipCode}<br>
              Phone: ${order.shippingInfo?.phone || 'N/A'}<br>
              Email: ${order.shippingInfo?.email || order.user?.email}
            </div>
            <div class="address" style="text-align: right;">
              <strong>From:</strong><br>
              V-Cart E-Commerce<br>
              123 Main Street, Tech City<br>
              Karnataka, India<br>
              support@vcart.com
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <div>Subtotal: ${formatCurrency(order.total)}</div>
            <div>Shipping: Free</div>
            <div class="grand-total">Total: ${formatCurrency(order.total)}</div>
          </div>
          <div style="margin-top: 100px; text-align: center; color: #888;">
            Thank you for shopping with V-Cart!
          </div>
        </body>
      </html>
    `;

    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Processing': return <Chip size="small" label="Processing" color="warning" icon={<Pending fontSize="small" />} />;
      case 'Shipped': return <Chip size="small" label="Shipped" color="info" icon={<LocalShipping fontSize="small" />} />;
      case 'Delivered': return <Chip size="small" label="Delivered" color="success" icon={<CheckCircle fontSize="small" />} />;
      case 'Cancelled': return <Chip size="small" label="Cancelled" color="error" icon={<Cancel fontSize="small" />} />;
      default: return <Chip size="small" label={status} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" color="#1b2430">
                Order Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Track, manage and process customer orders in real-time.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>Export</Button>
            <Button variant="contained" color="primary" onClick={fetchOrders} disabled={loading}>Refresh</Button>
        </Stack>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: <Payments />, color: '#2e7d32', trend: '+12%' },
          { label: 'Pending Orders', value: stats.pending, icon: <Pending />, color: '#ed6c02', trend: 'Needs action' },
          { label: 'Delivered', value: stats.delivered, icon: <CheckCircle />, color: '#1976d2', trend: 'Total' },
          { label: "Today's Revenue", value: formatCurrency(stats.revenueToday), icon: <TrendingUp />, color: '#9c27b0', trend: 'Today' },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ 
                height: '100%', 
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                borderRadius: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, borderRadius: 2 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="caption" sx={{ color: item.color, fontWeight: 'bold', bgcolor: `${item.color}10`, px: 1, py: 0.5, borderRadius: 1 }}>
                    {item.trend}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters and Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
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
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by ID, User, or Shipping Name..."
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
            sx={{ maxWidth: 500 }}
          />
          <IconButton color="primary">
            <FilterList />
          </IconButton>
        </Box>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
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
                <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">#{order._id.substring(order._id.length - 10).toUpperCase()}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(order.date).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.9rem' }}>
                            {order.user?.name?.charAt(0) || <Person />}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">{order.user?.name || 'Guest'}</Typography>
                            <Typography variant="caption" color="text.secondary">{order.user?.email || 'N/A'}</Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.items.length} Product(s)</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {order.items[0]?.productname} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">{formatCurrency(order.total)}</Typography>
                    <Typography variant="caption" color="success.main" fontWeight="bold">Paid</Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(order.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton color="primary" sx={{ bgcolor: 'primary.lightest' }} onClick={() => { setSelectedOrder(order); setOpenDetailDialog(true); }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Invoice">
                      <IconButton color="secondary" onClick={() => handleDownloadInvoice(order)}>
                        <Print fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small">
                        <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Order #{selectedOrder?._id.substring(selectedOrder?._id.length - 10).toUpperCase()}</Typography>
            <Typography variant="caption" color="text.secondary">Placed on {new Date(selectedOrder?.date).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<Print />} onClick={() => handleDownloadInvoice(selectedOrder)}>Invoice</Button>
              <IconButton onClick={() => setOpenDetailDialog(false)}><Cancel /></IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
          {selectedOrder && (
            <Grid container spacing={4}>
              {/* Left Side - Items */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Purchased Items</Typography>
                <Stack spacing={2} sx={{ mb: 4 }}>
                    {selectedOrder.items.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 2, p: 2, border: '1px solid #f0f0f0', borderRadius: 2 }}>
                            <Avatar variant="rounded" src={item.ImageURL} sx={{ width: 60, height: 60, bgcolor: '#f5f5f5' }}>
                                <Storefront />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" fontWeight="bold">{item.productname}</Typography>
                                <Typography variant="caption" color="text.secondary">Qty: {item.quantity} × {formatCurrency(item.price)}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold">{formatCurrency(item.price * item.quantity)}</Typography>
                        </Box>
                    ))}
                </Stack>
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Subtotal</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.total)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Shipping</Typography>
                        <Typography variant="body2" color="success.main">Free</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">{formatCurrency(selectedOrder.total)}</Typography>
                    </Box>
                </Box>
              </Grid>

              {/* Right Side - Shipping & Actions */}
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Customer & Shipping</Typography>
                <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Avatar sx={{ width: 40, height: 40 }}>{selectedOrder.user?.name?.charAt(0)}</Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">{selectedOrder.shippingInfo?.name || selectedOrder.user?.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{selectedOrder.shippingInfo?.email || selectedOrder.user?.email}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Shipping Address</Typography>
                            <Typography variant="body2">{selectedOrder.shippingInfo?.address}</Typography>
                            <Typography variant="body2">{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.zipCode}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Phone Number</Typography>
                            <Typography variant="body2">{selectedOrder.shippingInfo?.phone || 'N/A'}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Order Status</Typography>
                <Box sx={{ mb: 3 }}>
                    {getStatusChip(selectedOrder.status)}
                </Box>
                
                <FormControl fullWidth size="small">
                    <InputLabel>Update Status</InputLabel>
                    <Select
                        value={selectedOrder.status}
                        label="Update Status"
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    >
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ mt: 3 }}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        sx={{ mb: 1 }}
                        onClick={() => {
                            const email = selectedOrder.shippingInfo?.email || selectedOrder.user?.email;
                            if(email) window.location.href = `mailto:${email}?subject=Order Update - #${selectedOrder._id}`;
                            else Swal.fire('Error', 'No email address found for this customer', 'error');
                        }}
                    >
                        Contact Customer
                    </Button>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        color="error"
                        disabled={selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Delivered'}
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                    >
                        Cancel Order
                    </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          <Button onClick={() => setOpenDetailDialog(false)} variant="contained" sx={{ px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;

