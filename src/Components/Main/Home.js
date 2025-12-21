import React from 'react'
import Hero from './Hero'
import FeaturedCollections from './FeaturedCollections'
import FlashSales from '../FlashSales/FlashSales'
import Contactus from '../Contact/Contactus'
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Hero />
      <FeaturedCollections />
      
      {/* Trending / Flash Sales Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
                <Box>
                    <Typography variant="overline" color="secondary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>Don't Miss Out</Typography>
                    <Typography variant="h3" sx={{ mt: 1 }}>Trending Now</Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/products')}>View All</Button>
            </Box>
            <FlashSales /> 
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
          <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                 <Typography variant="overline" color="secondary" letterSpacing={2}>THE V-CART STANDARD</Typography>
                 <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', mt: 2 }}>Uncompromising Quality</Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display', color: 'secondary.main' }}>Premium Materials</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                          Sourced directly from the finest mills in Italy and Japan. We ensure every thread and fabric meets our rigorous standards.
                      </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display', color: 'secondary.main' }}>Expert Curation</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                          Every item in our collection is handpicked by master tailors to ensure it serves the needs of true professionals.
                      </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display', color: 'secondary.main' }}>Fast & Secure Shipping</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                          We understand the urgency of your projects. Our logistics network ensures your supplies arrive on time, every time.
                      </Typography>
                  </Box>
              </Box>
          </Container>
      </Box>

      <Contactus />
    </Box>
  )
}

export default Home