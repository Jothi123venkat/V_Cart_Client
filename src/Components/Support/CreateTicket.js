import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Divider,
  Paper,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, History as HistoryIcon, Add as AddIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const CreateTicket = ({ open, onClose, orderId }) => {
  const [view, setView] = useState('create'); // 'create' or 'history'
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Order Issue',
    message: ''
  });

  const categories = ['General', 'Order Issue', 'Product Defect', 'Refund Request', 'Other'];

  useEffect(() => {
    if (open) {
      fetchTickets();
      if (orderId) {
        setFormData(prev => ({ ...prev, subject: `Order Issue: ${orderId.substring(0, 10)}` }));
        setView('create');
      }
    }
  }, [open, orderId]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.message) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('vcart_token');
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.tickets.base}`, {
        ...formData,
        orderId: orderId || 'N/A'
      }, {
        headers: { 'x-auth-token': token }
      });

      Swal.fire('Success!', 'Your support ticket has been created', 'success');
      setFormData({ subject: '', category: 'Order Issue', message: '' });
      fetchTickets();
      setView('history');
    } catch (err) {
      console.error("Submit ticket error", err);
      Swal.fire('Error', 'Failed to create ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Open': 'error', 'In Progress': 'warning', 'Resolved': 'success' };
    return colors[status] || 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Support Center</Typography>
        <Box>
            <Button 
                startIcon={view === 'create' ? <HistoryIcon /> : <AddIcon />} 
                onClick={() => setView(view === 'create' ? 'history' : 'create')}
                sx={{ mr: 1 }}
            >
                {view === 'create' ? 'View History' : 'Raise New Ticket'}
            </Button>
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {view === 'create' ? (
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {orderId ? `Raising ticket for Order #${orderId.substring(0, 10)}` : 'How can we help you?'}
            </Typography>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                    {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="Describe your issue..."
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={submitting}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Submit Ticket'}
                </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ minHeight: 300 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
            ) : tickets.length === 0 ? (
              <Typography sx={{ textAlign: 'center', mt: 5 }} color="text.secondary">No ticket history found.</Typography>
            ) : (
              tickets.map((ticket) => (
                <Paper key={ticket._id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{ticket.subject}</Typography>
                    <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Order ID: {ticket.orderId} | Date: {new Date(ticket.date).toLocaleDateString()}
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicket;
