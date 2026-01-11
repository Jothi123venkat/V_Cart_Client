import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, TextField, Button, useTheme, alpha } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Send, Email, Phone, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isLight = theme.palette.mode === 'light';

    return (
        <Box 
            sx={{ 
                bgcolor: isLight ? '#0F172A' : '#020617',
                color: 'white',
                pt: 8,
                pb: 4,
                mt: 'auto',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.03,
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontFamily: 'Poppins',
                                fontWeight: 800,
                                mb: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            V-CART
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.7 }}>
                            Your one-stop destination for premium products. Experience quality, style, and convenience all in one place.
                        </Typography>
                        
                        {/* Contact Info */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 18, color: theme.palette.primary.light }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    support@vcart.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 18, color: theme.palette.primary.light }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    +91 1234567890
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 18, color: theme.palette.primary.light }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    India
                                </Typography>
                            </Box>
                        </Box>

                        {/* Social Icons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[
                                { icon: <Facebook />, link: '#' },
                                { icon: <Twitter />, link: '#' },
                                { icon: <Instagram />, link: '#' },
                                { icon: <LinkedIn />, link: '#' },
                            ].map((social, index) => (
                                <IconButton
                                    key={index}
                                    size="small"
                                    sx={{
                                        color: 'white',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main,
                                            transform: 'translateY(-4px)',
                                        },
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2.5 }}>
                            Shop
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                                { label: 'All Products', path: '/products' },
                                { label: 'New Arrivals', path: '/products' },
                                { label: 'Best Sellers', path: '/products' },
                                { label: 'On Sale', path: '/products' },
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: theme.palette.primary.light,
                                            paddingLeft: 1,
                                        },
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2.5 }}>
                            Support
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                                { label: 'Contact Us', path: '/support' },
                                { label: 'FAQ', path: '#' },
                                { label: 'Shipping Info', path: '#' },
                                { label: 'Returns', path: '#' },
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => link.path !== '#' && navigate(link.path)}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: theme.palette.primary.light,
                                            paddingLeft: 1,
                                        },
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Newsletter */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2.5 }}>
                            Stay Updated
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2.5, lineHeight: 1.7 }}>
                            Subscribe to our newsletter for exclusive deals, new arrivals, and special offers.
                        </Typography>
                        <Box 
                            component="form" 
                            sx={{ 
                                display: 'flex',
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                            }}
                        >
                            <TextField 
                                variant="outlined" 
                                size="small" 
                                placeholder="Enter your email" 
                                fullWidth
                                sx={{ 
                                    bgcolor: alpha('#ffffff', 0.1),
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': {
                                            borderColor: alpha('#ffffff', 0.2),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha('#ffffff', 0.3),
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.light,
                                        },
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'rgba(255,255,255,0.5)',
                                    },
                                }}
                            />
                            <Button 
                                variant="contained"
                                endIcon={<Send />}
                                sx={{
                                    px: 3,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                    },
                                }}
                            >
                                Subscribe
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: alpha('#ffffff', 0.1) }} />

                {/* Bottom Bar */}
                <Box 
                    sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        © {new Date().getFullYear()} V-CART. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link
                            href="#"
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: theme.palette.primary.light,
                                },
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: theme.palette.primary.light,
                                },
                            }}
                        >
                            Terms of Service
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
