import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <Box 
            sx={{ 
                position: 'relative',
                height: { xs: '500px', md: '700px' },
                width: '100%',
                bgcolor: '#0a1929', 
                color: 'white',
                overflow: 'hidden'
            }}
        >
            {/* Background Image Overlay */}
            <Box 
                component="img"
                src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2600&auto=format&fit=crop" // Thread/Needle aesthetic
                alt="Luxury Tailoring Supplies"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.6, 
                }}
            />
            
            {/* Gradient Overlay for visual depth */}
            <Box 
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(10, 25, 41, 0.95) 0%, rgba(10, 25, 41, 0.4) 100%)'
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'sticky', height: '100%', display: 'flex', alignItems: 'center' }}>
                <Grid container>
                    <Grid item xs={12} md={7}>
                        <Typography 
                            variant="overline" 
                            color="secondary" 
                            sx={{ letterSpacing: 3, fontWeight: 'bold', fontSize: '1rem' }}
                        >
                            EST. 2024 • TAILORING SUPPLIES
                        </Typography>
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                mt: 2, 
                                mb: 3, 
                                fontSize: { xs: '3rem', md: '5rem' },
                                lineHeight: 1.1,
                                fontFamily: '"Playfair Display", serif'
                            }}
                        >
                            Master the Art of <br />
                            <Box component="span" color="secondary.main">Elegance.</Box>
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300, maxWidth: '600px', lineHeight: 1.6 }}>
                            Premium embroidery threads, pure silk linings, and professional tailoring tools for the discerning designer. Use code <strong>CRAFT20</strong> for 20% off your first order.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            size="large"
                            onClick={() => navigate('/products')}
                            sx={{ 
                                borderRadius: 0, 
                                py: 2, 
                                px: 5,
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                letterSpacing: 2
                            }}
                        >
                            Shop Collection
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Hero;
