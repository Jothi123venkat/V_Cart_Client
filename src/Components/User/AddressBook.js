import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { Add, Delete, Edit, Home, Work } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const AddressBook = () => {
    const [addresses, setAddresses] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ label: '', street: '', city: '', state: '', zip: '' });

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
            const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.user.address}`, formData, {
                headers: { 'x-auth-token': token }
            });
            setAddresses(res.data); // Returns updated list
            setOpen(false);
            setFormData({ label: '', street: '', city: '', state: '', zip: '' });
        } catch (err) { alert('Failed to add address'); }
    };

    const handleDelete = async (id) => {
        if(!window.confirm('Delete this address?')) return;
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.user.address}/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setAddresses(res.data);
        } catch (err) { alert('Failed to delete'); }
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5">My Addresses</Typography>
                <Button startIcon={<Add />} variant="contained" onClick={() => setOpen(true)}>Add New</Button>
            </Box>

            <Grid container spacing={2}>
                {addresses.map((addr) => (
                    <Grid item xs={12} md={6} key={addr._id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box display="flex" justifyContent="space-between">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {addr.label === 'Home' ? <Home color="primary"/> : <Work color="secondary"/>}
                                        <Typography variant="subtitle1" fontWeight="bold">{addr.label}</Typography>
                                    </Box>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(addr._id)}><Delete /></IconButton>
                                </Box>
                                <Typography variant="body2" mt={1}>{addr.street}</Typography>
                                <Typography variant="body2">{addr.city}, {addr.state} {addr.zip}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="normal" label="Label (e.g. Home, Work)" value={formData.label} onChange={(e)=>setFormData({...formData, label: e.target.value})} />
                    <TextField fullWidth margin="normal" label="Street Address" value={formData.street} onChange={(e)=>setFormData({...formData, street: e.target.value})} />
                    <Grid container spacing={1}>
                        <Grid item xs={6}><TextField fullWidth margin="normal" label="City" value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} /></Grid>
                        <Grid item xs={3}><TextField fullWidth margin="normal" label="State" value={formData.state} onChange={(e)=>setFormData({...formData, state: e.target.value})} /></Grid>
                        <Grid item xs={3}><TextField fullWidth margin="normal" label="Zip" value={formData.zip} onChange={(e)=>setFormData({...formData, zip: e.target.value})} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddressBook;
