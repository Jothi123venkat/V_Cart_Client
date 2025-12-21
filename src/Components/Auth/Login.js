import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api'; // Ensure you have this config or use direct URL

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Direct API call
      // You'll need to replace URL with your actual backend URL if different
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      const { user, token } = response.data;
      login(user, token);
      
      // Redirect to home or previous page
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Grid container>
        {/* Left Side - Image */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=2000)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' }
          }} 
        />
        
        {/* Right Side - Form */}
        <Grid item xs={12} md={6} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%' }}>
            <Typography component="h1" variant="h3" sx={{ mb: 2, fontFamily: 'Playfair Display', color: 'primary.main', fontWeight: 'bold' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Sign in to manage your tailoring supplies
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                // Styling input
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary" // Gold button
                sx={{ mt: 4, mb: 3, py: 1.5, fontSize: '1rem', color: 'white' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary.main">
                    Don't have an account? <span style={{ fontWeight: 'bold', borderBottom: '1px solid' }}>Sign Up</span>
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
