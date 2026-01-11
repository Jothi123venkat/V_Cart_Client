import React from 'react'
import Hero from './Hero'
import FeaturedCollections from './FeaturedCollections'
import FlashSales from '../FlashSales/FlashSales'
import Contactus from '../Contact/Contactus'
import { Box, Typography, Container, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <Hero />
      <FeaturedCollections />
      
      {/* Trending / Flash Sales Section */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: theme.palette.mode === 'light' ? '#f8f9fa' : theme.palette.background.default,
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
                <Box>
                    <Typography 
                      variant="overline" 
                      color="secondary" 
                      sx={{ letterSpacing: 2, fontWeight: 'bold' }}
                    >
                      Don't Miss Out
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mt: 1,
                        color: theme.palette.text.primary,
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                      }}
                    >
                      Trending Now
                    </Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/products')}>View All</Button>
            </Box>
            <FlashSales /> 
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 15, bgcolor: '#0a1929', color: 'white', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Background Pattern */}
          <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              opacity: 0.5
          }}/>

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 10 }}>
                 <Typography variant="overline" color="secondary" letterSpacing={4} sx={{ fontWeight: 'bold' }}>THE V-CART STANDARD</Typography>
                 <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', mt: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Uncompromising Quality</Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 6 }}>
                  {[
                    { title: "Premium Materials", text: "Sourced directly from the finest mills in Italy and Japan. We ensure every thread and fabric meets our rigorous standards." },
                    { title: "Expert Curation", text: "Every item in our collection is handpicked by master tailors to ensure it serves the needs of true professionals." },
                    { title: "Fast & Secure Shipping", text: "We understand the urgency of your projects. Our logistics network ensures your supplies arrive on time, every time." }
                  ].map((item, index) => (
                    <Box 
                        key={index}
                        sx={{ 
                            textAlign: 'center', 
                            p: 5, 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 0,
                            bgcolor: 'rgba(255,255,255,0.02)',
                            transition: 'all 0.4s ease',
                            '&:hover': {
                                transform: 'translateY(-10px)',
                                bgcolor: 'rgba(255,255,255,0.05)',
                                borderColor: 'secondary.main',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        <Box sx={{ width: 60, height: 1, bgcolor: 'secondary.main', mx: 'auto', mb: 3 }} />
                        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display', color: 'white', mb: 2 }}>{item.title}</Typography>
                        <Typography variant="body1" sx={{ color: 'grey.400', lineHeight: 1.8 }}>
                            {item.text}
                        </Typography>
                    </Box>
                  ))}
              </Box>
          </Container>
      </Box>

      <Contactus />
    </Box>
  )
}

export default Home