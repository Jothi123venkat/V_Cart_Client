import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { AdminPanelSettings, Lock } from '@mui/icons-material';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await adminLogin(formData.email, formData.password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-5">
      <Card elevation={3}>
        <CardContent className="p-5">
          <Box className="text-center mb-4">
            <AdminPanelSettings sx={{ fontSize: 60, color: '#1976d2' }} />
            <Typography variant="h4" className="mt-2">Admin Login</Typography>
            <Typography variant="body2" color="text.secondary">
              Access the admin dashboard
            </Typography>
          </Box>

          {error && <Alert severity="error" className="mb-3">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="mt-4"
              startIcon={<Lock />}
            >
              Login to Admin Panel
            </Button>
          </form>

          <Box className="mt-3 text-center">
            <Typography variant="caption" color="text.secondary">
              Admin access only
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminLogin;
