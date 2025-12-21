import React from 'react';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const collections = [
    {
        title: "Embroidery Threads",
        image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=2000&auto=format&fit=crop",
        link: "/products?keyword=Threads"
    },
    {
        title: "Silk & Satin Linings",
        image: "https://images.unsplash.com/photo-1548142723-aae7678afa53?q=80&w=2000&auto=format&fit=crop",
        link: "/products?keyword=Linings"
    },
    {
        title: "Tailoring Tools",
        image: "https://images.unsplash.com/photo-1598300056393-8dd1a56113b2?q=80&w=2000&auto=format&fit=crop",
        link: "/products?keyword=Accessories"
    }
];

const FeaturedCollections = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ py: 10, bgcolor: 'white' }}>
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="secondary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>Categories</Typography>
                    <Typography variant="h3" sx={{ mt: 1 }}>Curated Collections</Typography>
                </Box>
                <Grid container spacing={4}>
                    {collections.map((item, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    position: 'relative', 
                                    height: 400, 
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    overflow: 'hidden',
                                    '&:hover .overlay': { opacity: 0.3 },
                                    '&:hover .zoom-img': { transform: 'scale(1.1)' }
                                }}
                                onClick={() => navigate(item.link)}
                            >
                                <CardMedia
                                    component="img"
                                    image={item.image}
                                    className="zoom-img"
                                    sx={{ 
                                        height: '100%', 
                                        width: '100%', 
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }}
                                />
                                <Box 
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%',
                                        bgcolor: 'black',
                                        opacity: 0.5,
                                        transition: 'opacity 0.3s'
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 40,
                                    left: 40,
                                    color: 'white'
                                }}>
                                    <Typography variant="h4">{item.title}</Typography>
                                    <Typography variant="button" sx={{ mt: 1, display: 'block', borderBottom: '1px solid white', width: 'fit-content' }}>Discover</Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturedCollections;
