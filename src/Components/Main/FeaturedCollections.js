import React from 'react';
import { Box, Container, Grid, Typography, Card, CardMedia, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useSiteConfig } from '../../context/SiteConfigContext';

const FeaturedCollections = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const { siteConfig } = useSiteConfig();

    const collections = siteConfig?.curatedCollections?.items?.length > 0 
        ? siteConfig.curatedCollections.items 
        : [
            {
                title: "Embroidery Threads",
                image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=2000&auto=format&fit=crop",
                link: "/products?category=Threads"
            },
            {
                title: "Silk & Satin Linings",
                image: "https://images.unsplash.com/photo-1548142723-aae7678afa53?q=80&w=2000&auto=format&fit=crop",
                link: "/products?category=Linings"
            },
            {
                title: "Tailoring Tools",
                image: "https://images.unsplash.com/photo-1598300056393-8dd1a56113b2?q=80&w=2000&auto=format&fit=crop",
                link: "/products?category=Accessories"
            }
        ];

    const sectionTitle = siteConfig?.curatedCollections?.title || "The Collection";
    const sectionSubtitle = siteConfig?.curatedCollections?.subtitle || "CURATED SELECTION";

    return (
        <Box 
            sx={{ 
                py: 12, 
                bgcolor: theme.palette.background.default,
                transition: 'background-color 0.3s ease',
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography 
                        variant="overline" 
                        color="secondary" 
                        sx={{ 
                            letterSpacing: 3, 
                            fontWeight: 'bold',
                            display: 'block',
                            mb: 1
                        }}
                    >
                        {sectionSubtitle}
                    </Typography>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontFamily: 'Poppins',
                            fontWeight: 700,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            color: theme.palette.text.primary,
                        }}
                    >
                        {sectionTitle}
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    {collections.map((item, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    position: 'relative', 
                                    height: 500, 
                                    cursor: 'pointer',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: isLight 
                                        ? '0 4px 20px rgba(0, 0, 0, 0.08)'
                                        : '0 4px 20px rgba(0, 0, 0, 0.4)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: isLight
                                            ? '0 12px 40px rgba(0, 0, 0, 0.15)'
                                            : '0 12px 40px rgba(0, 0, 0, 0.6)',
                                    },
                                    '&:hover .zoom-img': { transform: 'scale(1.1)' },
                                    '&:hover .overlay': { opacity: isLight ? 0.4 : 0.6 },
                                    '&:hover .content-box': { transform: 'translateY(0)', opacity: 1 },
                                    '&:hover .title-box': { transform: 'translateY(-20px)' }
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
                                        transition: 'transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)'
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
                                        opacity: isLight ? 0.2 : 0.5,
                                        transition: 'opacity 0.4s ease'
                                    }}
                                />
                                
                                <Box 
                                    className="title-box"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 60,
                                        left: 0,
                                        width: '100%',
                                        textAlign: 'center',
                                        color: 'white',
                                        transition: 'transform 0.4s ease',
                                        zIndex: 2
                                    }}
                                >
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontFamily: 'Poppins',
                                            fontWeight: 700,
                                            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                </Box>

                                <Box 
                                    className="content-box"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 40,
                                        left: 0,
                                        width: '100%',
                                        textAlign: 'center',
                                        color: 'white',
                                        transform: 'translateY(20px)',
                                        opacity: 0,
                                        transition: 'all 0.4s ease 0.1s',
                                        zIndex: 2
                                    }}
                                >
                                    <Typography 
                                        variant="button" 
                                        sx={{ 
                                            position: 'relative',
                                            display: 'inline-block', 
                                            pb: 0.5,
                                            letterSpacing: 2,
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                bgcolor: 'white',
                                                boxShadow: '0 2px 10px rgba(255,255,255,0.5)',
                                            }
                                        }}
                                    >
                                        Discover Collection
                                    </Typography>
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
