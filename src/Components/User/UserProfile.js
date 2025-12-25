import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Tabs, Tab, Box, 
  Avatar, TextField, Button, Alert, List, ListItem, ListItemText, Divider, Chip, CircularProgress 
} from '@mui/material';
import { Person, LocationOn, Favorite, ShoppingBag, HelpOutline, History } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AddressBook from './AddressBook';
import Wishlist from './Wishlist';
import Orders from '../../Your_orders/Orders'; 
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth(); // login used to update local user state
  const [tabFor, setTabFor] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'support') setTabFor(4);
    else if (tab === 'orders') setTabFor(3);
    else if (tab === 'activity') setTabFor(5);
  }, [location]);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [msg, setMsg] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Fetch latest profile data
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.user.profile}`, {
                headers: { 'x-auth-token': token }
            });
            setProfileData({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone || ''
            });
        } catch (err) {
            console.error(err);
        }
    }
    if(user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (user && tabFor === 4) {
      fetchTickets();
    }
  }, [user, tabFor]);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const token = localStorage.getItem('vcart_token');
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.mine}`, {
        headers: { 'x-auth-token': token }
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Fetch tickets error", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Open': 'error', 'In Progress': 'warning', 'Resolved': 'success' };
    return colors[status] || 'default';
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
      try {
        const token = localStorage.getItem('vcart_token');
        const res = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.user.profile}`, profileData, {
            headers: { 'x-auth-token': token }
        });
        // Update context/local storage if needed, or just show success
        setMsg({ type: 'success', text: 'Profile updated successfully' });
      } catch (err) {
          setMsg({ type: 'error', text: 'Failed to update profile' });
      }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
              {profileData.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6">{profileData.name}</Typography>
            <Typography variant="body2" color="text.secondary">{profileData.email}</Typography>
            
            <Tabs 
              orientation="vertical" 
              value={tabFor} 
              onChange={(e, v) => setTabFor(v)}
              sx={{ mt: 3, borderRight: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} iconPosition="start" label="My Profile" />
              <Tab icon={<LocationOn />} iconPosition="start" label="Addresses" />
              <Tab icon={<Favorite />} iconPosition="start" label="Wishlist" />
              <Tab icon={<ShoppingBag />} iconPosition="start" label="Orders" />
              <Tab icon={<HelpOutline />} iconPosition="start" label="Support" />
              <Tab icon={<History />} iconPosition="start" label="Activity" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 3, minHeight: 400 }}>
            {tabFor === 0 && (
              <Box>
                <Typography variant="h5" mb={3}>Personal Information</Typography>
                {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Full Name" name="name" value={profileData.name} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email" disabled value={profileData.email} helperText="Email cannot be changed" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Phone Number" name="phone" value={profileData.phone} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabFor === 1 && <AddressBook />}
            {tabFor === 2 && <Wishlist />}
            {tabFor === 3 && <Orders />} 
            
            {tabFor === 4 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Support Tickets</Typography>
                    <Button variant="outlined" startIcon={<HelpOutline />} onClick={() => setTabFor(4)}>
                      Get Help
                    </Button>
                </Box>
                
                {loadingTickets ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
                ) : tickets.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography color="text.secondary">You haven't raised any tickets yet.</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/Yourorders')}>
                      Go to Orders to raise a ticket
                    </Button>
                  </Box>
                ) : (
                  tickets.map((ticket) => (
                    <Paper key={ticket._id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{ticket.subject}</Typography>
                        <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Category: {ticket.category} | Date: {new Date(ticket.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, mt: 1 }}>
                        <strong>You:</strong> {ticket.message}
                      </Typography>
                      {ticket.adminResponse && (
                        <Typography variant="body2" sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1, mt: 1, borderLeft: '4px solid #2196f3' }}>
                          <strong>Admin Response:</strong> {ticket.adminResponse}
                        </Typography>
                      )}
                    </Paper>
                  ))
                )}
              </Box>
            )}

            {tabFor === 5 && (
              <Box>
                <Typography variant="h5" mb={3}>Activity History</Typography>
                <List sx={{ p: 0 }}>
                  {user.activityLog && user.activityLog.length > 0 ? (
                    user.activityLog.slice().reverse().map((log, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
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
                      <Typography color="text.secondary">No activity history found.</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
