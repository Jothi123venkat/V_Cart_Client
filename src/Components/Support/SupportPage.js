import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Chip, Button, 
  CircularProgress, Divider, Grid, IconButton, Breadcrumbs, Link
} from '@mui/material';
import { 
  NavigateNext as NavigateNextIcon, 
  Add as AddIcon, 
  History as HistoryIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import CreateTicket from './CreateTicket';

const SupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.tickets.mine}`, {
                headers: { 'x-auth-token': token }
            });
            setTickets(res.data);
        } catch (err) {
            console.error("Fetch tickets error", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = { 'Open': 'error', 'In Progress': 'warning', 'Resolved': 'success' };
        return colors[status] || 'default';
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                        Home
                    </Link>
                    <Typography color="text.primary">Support Center</Typography>
                </Breadcrumbs>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SupportIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4" fontWeight="bold">Support Center</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => setTicketDialogOpen(true)}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Raise New Ticket
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={0} variant="outlined" sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                                <HistoryIcon fontSize="small" /> Ticket History
                            </Typography>
                        </Box>
                        
                        <Box sx={{ p: 3, minHeight: 400 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                    <CircularProgress />
                                </Box>
                            ) : tickets.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No tickets found
                                    </Typography>
                                    <Typography color="text.secondary" mb={3}>
                                        If you're having trouble with an order or have a general inquiry, feel free to raise a ticket.
                                    </Typography>
                                    <Button variant="outlined" onClick={() => navigate('/Yourorders')}>
                                        Go to Orders
                                    </Button>
                                </Box>
                            ) : (
                                tickets.map((ticket) => (
                                    <Paper 
                                        key={ticket._id} 
                                        elevation={0} 
                                        variant="outlined" 
                                        sx={{ 
                                            p: 3, 
                                            mb: 3, 
                                            borderRadius: 2,
                                            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(33, 150, 243, 0.02)' },
                                            transition: '0.2s'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    {ticket.subject}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                                    <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                                                        <strong>Category:</strong> {ticket.category}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                                                        <strong>Order ID:</strong> {ticket.orderId}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                                                        <strong>Raised on:</strong> {new Date(ticket.date).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip 
                                                label={ticket.status} 
                                                color={getStatusColor(ticket.status)} 
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>Your Message:</Typography>
                                            <Typography variant="body1">{ticket.message}</Typography>
                                        </Box>

                                        {ticket.adminResponse ? (
                                            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, borderLeft: '4px solid #2196f3' }}>
                                                <Typography variant="subtitle2" color="primary" gutterBottom>Admin Response:</Typography>
                                                <Typography variant="body1">{ticket.adminResponse}</Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', pl: 2 }}>
                                                Waiting for admin response...
                                            </Typography>
                                        )}
                                    </Paper>
                                ))
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <CreateTicket 
                open={ticketDialogOpen} 
                onClose={() => { setTicketDialogOpen(false); fetchTickets(); }} 
            />
        </Container>
    );
};

export default SupportPage;
