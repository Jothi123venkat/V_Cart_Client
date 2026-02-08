import React, { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Button, Box, Chip,
    CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { Check, Close, Visibility } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import Swal from 'sweetalert2';

const ReturnManagement = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            const token = localStorage.getItem('vcart_token');
            // Reusing the all orders endpoint but filtering for 'Return Requested'
            const res = await axios.get(`${API_BASE_URL}/api/orders/all?status=Return Requested`, {
                headers: { 'x-auth-token': token }
            });
            setReturns(res.data);
        } catch (err) {
            console.error("Fetch returns error", err);
            Swal.fire('Error', 'Failed to fetch return requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        const action = newStatus === 'Returned' ? 'approve' : 'reject';
        const finalStatus = newStatus === 'Delivered' ? 'Return Rejected' : newStatus;
        
        Swal.fire({
            title: `Are you sure you want to ${action} this return?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('vcart_token');
                    await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, 
                        { status: finalStatus },
                        { headers: { 'x-auth-token': token } }
                    );
                    
                    Swal.fire('Updated!', `Order status changed to ${finalStatus}`, 'success');
                    fetchReturns();
                } catch (err) {
                    Swal.fire('Error', 'Failed to update order status', 'error');
                }
            }
        });
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Returning Orders
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage customer return requests and approve/reject them.
            </Typography>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Items</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {returns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No pending return requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            returns.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>#{order._id.substring(0, 10)}</TableCell>
                                    <TableCell>
                                        {order.user?.name}<br/>
                                        <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        {order.items.map(i => `${i.productname} (x${i.quantity})`).join(', ')}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                            "{order.returnReason || 'No reason provided'}"
                                        </Typography>
                                    </TableCell>
                                    <TableCell>₹{order.total}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Approve Return">
                                                <IconButton 
                                                    color="success" 
                                                    onClick={() => updateStatus(order._id, 'Returned')}
                                                >
                                                    <Check />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject/Keep Delivered">
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => updateStatus(order._id, 'Delivered')}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ReturnManagement;
