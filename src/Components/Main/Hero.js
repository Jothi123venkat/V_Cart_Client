import React from 'react';
import { Box, Typography, Button, Container, Grid, keyframes, useTheme, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, TrendingUp } from '@mui/icons-material';
import { useSiteConfig } from '../../context/SiteConfigContext';

// Keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const Hero = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const { siteConfig } = useSiteConfig();

    return (
        <Box 
            sx={{ 
                position: 'relative',
                minHeight: { xs: '600px', md: '700px' },
                width: '100%',
                background: siteConfig?.heroImage 
                    ? `url(${siteConfig.heroImage}) no-repeat center center/cover`
                    : isLight
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
                color: 'white',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {/* Overlay for image background */}
            {siteConfig?.heroImage && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 0
                    }}
                />
            )}

            {/* Animated Background Shapes (only if no image) */}
            {!siteConfig?.heroImage && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.1,
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '10%',
                            right: '10%',
                            width: 400,
                            height: 400,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                            animation: `${float} 6s ease-in-out infinite`,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '5%',
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                            animation: `${float} 8s ease-in-out infinite`,
                            animationDelay: '1s',
                        }}
                    />
                </Box>
            )}

            {/* Gradient Overlay for pattern */}
            {!siteConfig?.heroImage && (
                <Box 
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(49, 46, 129, 0.95) 100%)',
                    }}
                />
            )}

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        {/* Badge */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 0.75,
                                borderRadius: 10,
                                backgroundColor: alpha('#ffffff', 0.15),
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                                mb: 3,
                                animation: `${fadeInUp} 0.8s ease-out forwards`,
                            }}
                        >
                            <TrendingUp sx={{ fontSize: 18 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                                NEW COLLECTION 2024
                            </Typography>
                        </Box>

                        {/* Main Heading */}
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                mb: 3,
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                lineHeight: 1.1,
                                fontFamily: 'Poppins',
                                fontWeight: 800,
                                animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
                                opacity: 0,
                                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {siteConfig?.heroTitle || 'Discover Your Perfect Style'}
                        </Typography>

                        {/* Subtitle */}
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 4,
                                opacity: 0,
                                fontWeight: 400,
                                maxWidth: '600px',
                                lineHeight: 1.7,
                                color: 'rgba(255, 255, 255, 0.9)',
                                animation: `${fadeInUp} 0.8s ease-out 0.4s forwards`
                            }}
                        >
                            {siteConfig?.heroSubtitle || 'Explore our curated collection of premium products. From fashion to electronics, find everything you need in one place.'}
                        </Typography>

                        {/* CTA Buttons */}
                        <Box 
                            sx={{ 
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap',
                                animation: `${fadeInUp} 0.8s ease-out 0.6s forwards`,
                                opacity: 0
                            }}
                        >
                            <Button 
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/products')}
                                sx={{ 
                                    py: 1.75,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    color: '#ffffff',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
                                    }
                                }}
                            >
                                {siteConfig?.heroButtonText || 'Shop Now'}
                            </Button>
                            <Button 
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/products')}
                                sx={{ 
                                    py: 1.75,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    color: '#ffffff',
                                    borderWidth: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: '#ffffff',
                                        backgroundColor: alpha('#ffffff', 0.1),
                                        borderWidth: 2,
                                        transform: 'translateY(-4px)',
                                    }
                                }}
                            >
                                Explore Categories
                            </Button>
                        </Box>

                        {/* Stats */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 4,
                                mt: 6,
                                animation: `${fadeInUp} 0.8s ease-out 0.8s forwards`,
                                opacity: 0,
                            }}
                        >
                            {[
                                { value: '10K+', label: 'Products' },
                                { value: '5K+', label: 'Happy Customers' },
                                { value: '99%', label: 'Satisfaction' },
                            ].map((stat, index) => (
                                <Box key={index}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Side - Optional Decorative Element */}
                    <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {/* Decorative Circles - Only show if no background image for cleaner look */}
                            {!siteConfig?.heroImage && (
                                <>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 400,
                                            height: 400,
                                            borderRadius: '50%',
                                            border: `2px solid ${alpha('#ffffff', 0.2)}`,
                                            animation: `${float} 6s ease-in-out infinite`,
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 300,
                                            height: 300,
                                            borderRadius: '50%',
                                            border: `2px solid ${alpha('#ffffff', 0.3)}`,
                                            animation: `${float} 8s ease-in-out infinite`,
                                            animationDelay: '1s',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 200,
                                            height: 200,
                                            borderRadius: '50%',
                                            backgroundColor: alpha('#ffffff', 0.1),
                                            backdropFilter: 'blur(20px)',
                                            animation: `${float} 10s ease-in-out infinite`,
                                            animationDelay: '2s',
                                        }}
                                    />
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Hero;
