import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, TextField, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Send } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', pt: 8, pb: 4, mt: 'auto' }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold', mb: 2, color: 'secondary.main' }}>
                            V-CART
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
                            Experience the ultimate in luxury shopping. Curated collections for the discerning individual.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="secondary" size="small"><Facebook /></IconButton>
                            <IconButton color="secondary" size="small"><Twitter /></IconButton>
                            <IconButton color="secondary" size="small"><Instagram /></IconButton>
                            <IconButton color="secondary" size="small"><LinkedIn /></IconButton>
                        </Box>
                    </Grid>

                    {/* Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Shop</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/products" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>New Arrivals</Link>
                            <Link href="/products" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>Bestsellers</Link>
                            <Link href="/products" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>On Sale</Link>
                            <Link href="/products" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>Gift Cards</Link>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Support</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>Contact Us</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>FAQ</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>Shipping</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: 'grey.400' }}>Returns</Link>
                        </Box>
                    </Grid>

                    {/* Newsletter */}
                    <Grid item xs={12} md={4}>
                         <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Newsletter</Typography>
                         <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
                            Subscribe to receive updates, access to exclusive deals, and more.
                         </Typography>
                         <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                             <TextField 
                                variant="outlined" 
                                size="small" 
                                placeholder="Enter your email" 
                                fullWidth
                                sx={{ bgcolor: 'white', borderRadius: 1 }}
                             />
                             <Button variant="contained" color="secondary" endIcon={<Send />}>
                                 Join
                             </Button>
                         </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>
                        © 2024 V-CART. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                         <Typography variant="caption" sx={{ color: 'grey.500', cursor: 'pointer' }}>Privacy Policy</Typography>
                         <Typography variant="caption" sx={{ color: 'grey.500', cursor: 'pointer' }}>Terms of Service</Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
