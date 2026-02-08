import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Grid, Box, Typography, Button, Rating, 
    Divider, Paper, Skeleton
} from '@mui/material';
import { ShoppingCart, FlashOn, VerifiedUser } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import Swal from 'sweetalert2';
import ReviewSection from './ReviewSection';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.products.getById(id)}`);
            setProduct(res.data);
        } catch (err) {
            console.error("Fetch product error", err);
            Swal.fire("Error", "Product not found", "error");
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id, navigate]);

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { items: [{ product, quantity: 1 }], isBuyNow: true } });
    };

    if(loading) return (
        <Container sx={{ mt: 5 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Skeleton variant="rectangular" height={400} />
                </Grid>
                <Grid item xs={12} md={7}>
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                </Grid>
            </Grid>
        </Container>
    );

    if(!product) return null;

    return (
        <Container maxWidth="xl" sx={{ mt: 5, mb: 10 }}>
            <Grid container spacing={4}>
                {/* Left: Image */}
                <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                     <Box 
                        component="img"
                        src={product.ImageURL}
                        alt={product.productname}
                        sx={{ 
                            maxWidth: '100%', 
                            maxHeight: 500, 
                            objectFit: 'contain',
                            border: '1px solid #eee',
                            p: 2
                        }}
                     />
                </Grid>

                {/* Middle: Details */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
                        {product.productname}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>{product.rating || 0}</Typography>
                        <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="primary" sx={{ ml: 1, cursor: 'pointer' }}>
                            {product.reviewCount || 0} ratings
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">Price:</Typography>
                        <Typography variant="h4" color="error" component="span" sx={{ ml: 1 }}>
                            ${product.price}
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph>
                        {product.productdescription}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">About this item</Typography>
                        <ul style={{ paddingLeft: 20 }}>
                            <li>Highly durable and long lasting.</li>
                            <li>Premium quality material.</li>
                            <li>1 Year Manufacturer Warranty.</li>
                        </ul>
                    </Box>
                </Grid>

                {/* Right: Buy Box */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" color="error" gutterBottom>${product.price}</Typography>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Delivery by <strong>Tomorrow, Dec 16</strong>
                        </Typography>
                        
                        <Typography variant="h6" color={product.stock > 0 ? "success.main" : "error.main"} gutterBottom>
                            {product.stock > 0 ? "In Stock" : "Currently Unavailable"}
                        </Typography>
                        
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                startIcon={<ShoppingCart />}
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                                sx={{ borderRadius: 1.5 }}
                            >
                                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                            <Button 
                                variant="contained" 
                                color="warning" 
                                fullWidth 
                                startIcon={<FlashOn />}
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                sx={{ borderRadius: 1.5, bgcolor: '#fa8900', '&:hover': { bgcolor: '#e67e00' } }}
                            >
                                {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <VerifiedUser fontSize="small" />
                            <Typography variant="caption">Secure transaction</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Review Section */}
            <Divider sx={{ my: 6 }} />
            <ReviewSection productId={id} onReviewAdded={fetchProduct} />
        </Container>
    );
};

export default ProductDetails;
