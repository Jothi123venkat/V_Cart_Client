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
  Box
} from '@mui/material';
import Swal from 'sweetalert2';

const CreateTicket = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'General',
    message: ''
  });

  const categories = ['General', 'Order Issue', 'Product Defect', 'Refund Request', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.message) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    // Save ticket to localStorage
    const tickets = JSON.parse(localStorage.getItem('vcart_tickets') || '[]');
    const newTicket = {
      id: Date.now(),
      ...formData,
      status: 'Open',
      priority: 'Medium',
      date: new Date().toISOString()
    };
    tickets.push(newTicket);
    localStorage.setItem('vcart_tickets', JSON.stringify(tickets));

    Swal.fire('Success!', 'Your support ticket has been created', 'success');
    setFormData({ subject: '', category: 'General', message: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Support Ticket</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicket;
