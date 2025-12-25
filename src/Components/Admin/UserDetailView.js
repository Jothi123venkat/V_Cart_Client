import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Typography, Grid, 
  List, ListItem, ListItemText, Divider, Chip, Box, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const UserDetailView = ({ open, onClose, user }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (open && user && tabIndex === 2) {
      fetchUserOrders();
    }
  }, [open, user, tabIndex]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders.getUserOrders(user._id)}`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch user orders error", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        User Details: {user.name}
        <Box mt={1}>
           <Chip 
             label={user.status || 'Active'} 
             color={user.status === 'suspended' ? 'error' : 'success'} 
             size="small" 
             sx={{ textTransform: 'capitalize' }}
            />
            <Chip 
              label={user.role?.toUpperCase()} 
              variant="outlined"
              size="small" 
              sx={{ ml: 1 }}
            />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Profile" />
          <Tab label="Activity History" />
          <Tab label="Order History" />
        </Tabs>

        <Box sx={{ minHeight: 400 }}>
          {tabIndex === 0 && (
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Full Name</Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>{user.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Email Address</Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>{user.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1" gutterBottom>{user.phone || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1" gutterBottom>{new Date(user.createdAt).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Saved Shipping Addresses</Typography>
                  {user.addresses && user.addresses.length > 0 ? (
                      <Grid container spacing={2}>
                        {user.addresses.map((addr, idx) => (
                            <Grid item xs={12} sm={6} key={idx}>
                              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="subtitle2" fontWeight="bold">{addr.label}</Typography>
                                  {addr.isDefault && <Chip label="Default" size="small" color="primary" sx={{ height: 20 }} />}
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {addr.street}<br />
                                  {addr.city}, {addr.state} {addr.zip}<br />
                                  {addr.country}
                                </Typography>
                              </Paper>
                            </Grid>
                        ))}
                      </Grid>
                  ) : <Typography color="text.secondary">No addresses saved by this user.</Typography>}
              </Grid>
            </Grid>
          )}

          {tabIndex === 1 && (
              <List sx={{ py: 0 }}>
                  {user.activityLog && user.activityLog.length > 0 ? (
                      user.activityLog.slice().reverse().map((log, index) => (
                          <React.Fragment key={index}>
                            <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                                <ListItemText 
                                    primary={
                                      <Typography variant="subtitle2" fontWeight="bold">
                                        {log.action.replace(/_/g, ' ').toUpperCase()}
                                      </Typography>
                                    } 
                                    secondary={
                                      <Box component="span">
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          {new Date(log.date).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.primary">
                                          {log.details || 'No additional details available'}
                                        </Typography>
                                      </Box>
                                    } 
                                />
                            </ListItem>
                            {index < user.activityLog.length - 1 && <Divider component="li" />}
                          </React.Fragment>
                      ))
                  ) : (
                    <Box textAlign="center" py={5}>
                      <Typography color="text.secondary">No system activity recorded yet.</Typography>
                    </Box>
                  )}
              </List>
          )}

          {tabIndex === 2 && (
              <Box p={1}>
                {loadingOrders ? (
                  <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
                ) : orders.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell><strong>OrderID</strong></TableCell>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Total</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>#{order._id.substring(order._id.length - 6)}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>₹{order.total}</TableCell>
                            <TableCell>
                              <Chip 
                                label={order.status} 
                                size="small" 
                                color={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'error' : 'warning'}
                                sx={{ height: 20, fontSize: '0.75rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box textAlign="center" py={5}>
                    <Typography color="text.secondary">No order history found for this user.</Typography>
                  </Box>
                )}
              </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailView;
