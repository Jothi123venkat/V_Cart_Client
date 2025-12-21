import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      const { user, token } = response.data;
      login(user, token);
      
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2600)',
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
              Create Account
            </Typography>
             <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join our exclusive tailoring community
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
                id="name"
                label="Full Name"
                name="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 4, mb: 3, py: 1.5, fontSize: '1rem', color: 'white' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary.main">
                     Already have an account? <span style={{ fontWeight: 'bold', borderBottom: '1px solid' }}>Sign In</span>
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

export default Signup;
