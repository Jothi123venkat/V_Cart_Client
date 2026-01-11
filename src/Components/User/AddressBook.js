import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, IconButton, Dialog, 
  DialogTitle, DialogContent, TextField, DialogActions, Chip, Radio
} from '@mui/material';
import {  Add, Delete, Edit, Home, Work, LocationOn, Star, StarBorder } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import toast from '../../utils/toast';

const AddressBook = () => {
    const [addresses, setAddresses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({ label: '', street: '', city: '', state: '', zip: '', country: 'India' });

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.user.profile}`, {
                headers: { 'x-auth-token': token }
            });
            setAddresses(res.data.addresses || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('vcart_token');
            const endpoint = `${API_BASE_URL}${API_ENDPOINTS.user.address}`;
            
            const res = await axios.post(endpoint, formData, {
                headers: { 'x-auth-token': token }
            });
            
            setAddresses(res.data);
            handleCloseDialog();
            toast.success('Address added successfully!');
        } catch (err) { 
            console.error('Add address error:', err);
            const errorMsg = err.response?.data?.message || 'Failed to add address';
            toast.error(errorMsg);
        }
    };

    const handleEdit = async () => {
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.put(
                `${API_BASE_URL}${API_ENDPOINTS.user.address}/${currentAddress._id}`,
                formData,
                { headers: { 'x-auth-token': token } }
            );
            setAddresses(res.data);
            handleCloseDialog();
            toast.success('Address updated successfully!');
        } catch (err) {
            console.error('Edit address error:', err);
            toast.error('Failed to update address');
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await toast.confirm('Delete this address?', 'This action cannot be undone');
        if(!confirmed) return;
        
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.user.address}/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setAddresses(res.data);
            toast.success('Address deleted successfully!');
        } catch (err) { 
            console.error('Delete address error:', err);
            const errorMsg = err.response?.data?.message || 'Failed to delete address';
            toast.error(errorMsg);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.put(
                `${API_BASE_URL}${API_ENDPOINTS.user.address}/${id}/default`,
                {},
                { headers: { 'x-auth-token': token } }
            );
            setAddresses(res.data);
            toast.success('Default address updated!');
        } catch (err) {
            console.error('Set default error:', err);
            toast.error('Failed to set default address');
        }
    };

    const openEditDialog = (addr) => {
        setEditMode(true);
        setCurrentAddress(addr);
        setFormData({
            label: addr.label || '',
            street: addr.street || '',
            city: addr.city || '',
            state: addr.state || '',
            zip: addr.zip || '',
            country: addr.country || 'India'
        });
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setCurrentAddress(null);
        setFormData({ label: '', street: '', city: '', state: '', zip: '', country: 'India' });
    };

    const getAddressIcon = (label) => {
        switch(label?.toLowerCase()) {
            case 'home': return <Home color="primary" />;
            case 'office':
            case 'work': return <Work color="secondary" />;
            default: return <LocationOn color="action" />;
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">My Addresses</Typography>
                <Button 
                    startIcon={<Add />} 
                    variant="contained" 
                    onClick={() => setOpen(true)}
                    sx={{ textTransform: 'none' }}
                >
                    Add New Address
                </Button>
            </Box>

            {addresses.length === 0 ? (
                <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                    <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No addresses saved yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Add an address to make checkout faster
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                        Add Your First Address
                    </Button>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {addresses.map((addr) => (
                        <Grid item xs={12} md={6} key={addr._id}>
                            <Card 
                                variant="outlined" 
                                sx={{ 
                                    borderColor: addr.isDefault ? 'primary.main' : 'divider',
                                    borderWidth: addr.isDefault ? 2 : 1,
                                    position: 'relative',
                                    '&:hover': { boxShadow: 2 }
                                }}
                            >
                                <CardContent>
                                    {addr.isDefault && (
                                        <Chip 
                                            label="DEFAULT" 
                                            size="small" 
                                            color="primary"
                                            icon={<Star />}
                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                        />
                                    )}
                                    
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        {getAddressIcon(addr.label)}
                                        <Typography variant="h6" fontWeight="bold">
                                            {addr.label || 'Address'}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" gutterBottom>
                                        {addr.street}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.city}, {addr.state} {addr.zip}
                                    </Typography>
                                    {addr.country && (
                                        <Typography variant="body2" color="text.secondary">
                                            {addr.country}
                                        </Typography>
                                    )}

                                    <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                                        {!addr.isDefault && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                startIcon={<StarBorder />}
                                                onClick={() => handleSetDefault(addr._id)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Set as Default
                                            </Button>
                                        )}
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => openEditDialog(addr)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDelete(addr._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Label (e.g. Home, Office)" 
                        value={formData.label} 
                        onChange={(e)=>setFormData({...formData, label: e.target.value})} 
                    />
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Street Address" 
                        value={formData.street} 
                        onChange={(e)=>setFormData({...formData, street: e.target.value})}
                        multiline
                        rows={2}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                margin="normal" 
                                label="City" 
                                value={formData.city} 
                                onChange={(e)=>setFormData({...formData, city: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                margin="normal" 
                                label="State" 
                                value={formData.state} 
                                onChange={(e)=>setFormData({...formData, state: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                margin="normal" 
                                label="ZIP Code" 
                                value={formData.zip} 
                                onChange={(e)=>setFormData({...formData, zip: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                margin="normal" 
                                label="Country" 
                                value={formData.country} 
                                onChange={(e)=>setFormData({...formData, country: e.target.value})} 
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={editMode ? handleEdit : handleAdd} 
                        variant="contained"
                        disabled={!formData.street || !formData.city}
                    >
                        {editMode ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddressBook;
