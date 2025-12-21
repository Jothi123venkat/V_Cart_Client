import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography
} from '@mui/material';

const UserEditDialog = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'active'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(user._id, formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight="bold">Edit User Profile</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
            Update user information and administrative settings.
        </Typography>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          type="email"
          variant="outlined"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Administrative Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            label="Administrative Role"
            onChange={handleChange}
          >
            <MenuItem value="user">Standard User</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Account Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            label="Account Status"
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ px: 3 }}>
            Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
