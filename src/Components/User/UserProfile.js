import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Tabs, Tab, Box, 
  Avatar, TextField, Button, Alert 
} from '@mui/material';
import { Person, LocationOn, Favorite, ShoppingBag, Settings } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import AddressBook from './AddressBook';
import Wishlist from './Wishlist';
import Orders from '../../Your_orders/Orders'; // Reusing existing Orders component
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const UserProfile = () => {
  const { user, login } = useAuth(); // login used to update local user state
  const [tabFor, setTabFor] = useState(0);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [msg, setMsg] = useState(null);

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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
