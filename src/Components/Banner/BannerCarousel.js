import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BannerCarousel = () => {
  const navigate = useNavigate();

  // Get banners from localStorage (admin-managed)
  const banners = JSON.parse(localStorage.getItem('vcart_banners') || '[]')
    .filter(b => b.active)
    .sort((a, b) => a.order - b.order);

  // Default banner if none exist
  const defaultBanner = {
    title: 'Welcome to V-Cart',
    subtitle: 'Your One-Stop Shopping Destination',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop',
    link: '/products'
  };

  const displayBanners = banners.length > 0 ? banners : [defaultBanner];

  return (
    <Box sx={{ mb: 4 }}>
      {displayBanners.map((banner, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            height: { xs: 300, md: 400 },
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${banner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Container>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' }
              }}
            >
              {banner.title}
            </Typography>
            {banner.subtitle && (
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  mb: 3,
                  fontSize: { xs: '1rem', md: '1.5rem' }
                }}
              >
                {banner.subtitle}
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(banner.link || '/products')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Shop Now
            </Button>
          </Container>
        </Box>
      ))}
    </Box>
  );
};

export default BannerCarousel;
