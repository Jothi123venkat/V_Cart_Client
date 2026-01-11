import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Card, CardMedia, CardContent, Button, 
    IconButton, CircularProgress, Rating, CardActions, Checkbox,
    FormControlLabel, Menu, MenuItem, Chip, Tooltip, Divider
} from '@mui/material';
import { 
    Delete, ShoppingCart, FlashOn, FavoriteBorder, MoveDown,
    MoreVert, Sort, LocalOffer
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from '../../utils/toast';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, priceLow, priceHigh, name
    const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('vcart_token');
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}`, {
                headers: { 'x-auth-token': token }
            });
            setWishlist(response.data.wishlist || []);
        } catch (err) {
            console.error('Wishlist fetch error:', err);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const token = localStorage.getItem('vcart_token');
            await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}/${productId}`, {
                headers: { 'x-auth-token': token }
            });
            setWishlist(wishlist.filter(item => item._id !== productId));
            setSelectedItems(selectedItems.filter(id => id !== productId));
            toast.success('Removed from wishlist');
        } catch (err) {
            console.error('Remove from wishlist error:', err);
            toast.error('Failed to remove item');
        }
    };

    const handleMoveToCart = async (product) => {
        try {
            // Add to cart
            await addToCart(product);
            
            // Remove from wishlist
            const token = localStorage.getItem('vcart_token');
            await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}/${product._id}`, {
                headers: { 'x-auth-token': token }
            });
            
            setWishlist(wishlist.filter(item => item._id !== product._id));
            setSelectedItems(selectedItems.filter(id => id !== product._id));
            toast.success(`${product.productname} moved to cart!`);
        } catch (err) {
            console.error('Move to cart error:', err);
            toast.error('Failed to move to cart');
        }
    };

    const handleBuyNow = (product) => {
        navigate('/checkout', { state: { items: [{ product, quantity: 1 }], isBuyNow: true } });
    };

    const handleSelectItem = (productId) => {
        if (selectedItems.includes(productId)) {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === wishlist.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(wishlist.map(item => item._id));
        }
    };

    const handleRemoveSelected = async () => {
        const confirmed = await toast.confirm(
            'Remove selected items?',
            `This will remove ${selectedItems.length} items from your wishlist`,
            { confirmButtonText: 'Yes, remove them' }
        );
        
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('vcart_token');
            await Promise.all(
                selectedItems.map(id =>
                    axios.delete(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}/${id}`, {
                        headers: { 'x-auth-token': token }
                    })
                )
            );
            setWishlist(wishlist.filter(item => !selectedItems.includes(item._id)));
            setSelectedItems([]);
            toast.success(`Removed ${selectedItems.length} items from wishlist`);
        } catch (err) {
            console.error('Bulk remove error:', err);
            toast.error('Failed to remove items');
        }
    };

    const handleMoveSelectedToCart = async () => {
        try {
            const itemsToMove = wishlist.filter(item => selectedItems.includes(item._id));
            const token = localStorage.getItem('vcart_token');

            // Add all to cart
            for (const item of itemsToMove) {
                await addToCart(item);
            }

            // Remove from wishlist
            await Promise.all(
                selectedItems.map(id =>
                    axios.delete(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}/${id}`, {
                        headers: { 'x-auth-token': token }
                    })
                )
            );

            setWishlist(wishlist.filter(item => !selectedItems.includes(item._id)));
            setSelectedItems([]);
            toast.success(`Moved ${itemsToMove.length} items to cart!`);
        } catch (err) {
            console.error('Bulk move to cart error:', err);
            toast.error('Failed to move items to cart');
        }
    };

    const getSortedWishlist = () => {
        const sorted = [...wishlist];
        switch (sortBy) {
            case 'priceLow':
                return sorted.sort((a, b) => a.price - b.price);
            case 'priceHigh':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
                return sorted.sort((a, b) => a.productname.localeCompare(b.productname));
            default:
                return sorted.reverse(); // Latest first
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        );
    }

    const sortedWishlist = getSortedWishlist();

    return (
        <Box>
            {/* Header with actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                </Typography>

                {wishlist.length > 0 && (
                    <Box display="flex" gap={1} flexWrap="wrap">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedItems.length === wishlist.length && wishlist.length > 0}
                                    indeterminate={selectedItems.length > 0 && selectedItems.length < wishlist.length}
                                    onChange={handleSelectAll}
                                />
                            }
                            label="Select All"
                        />
                        
                        {selectedItems.length > 0 && (
                            <>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<MoveDown />}
                                    onClick={handleMoveSelectedToCart}
                                >
                                    Move to Cart ({selectedItems.length})
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={handleRemoveSelected}
                                >
                                    Remove ({selectedItems.length})
                                </Button>
                            </>
                        )}

                        <IconButton onClick={(e) => setSortMenuAnchor(e.currentTarget)} size="small">
                            <Sort />
                        </IconButton>
                        <Menu
                            anchorEl={sortMenuAnchor}
                            open={Boolean(sortMenuAnchor)}
                            onClose={() => setSortMenuAnchor(null)}
                        >
                            <MenuItem onClick={() => { setSortBy('dateAdded'); setSortMenuAnchor(null); }}>
                                Recently Added
                            </MenuItem>
                            <MenuItem onClick={() => { setSortBy('priceLow'); setSortMenuAnchor(null); }}>
                                Price: Low to High
                            </MenuItem>
                            <MenuItem onClick={() => { setSortBy('priceHigh'); setSortMenuAnchor(null); }}>
                                Price: High to Low
                            </MenuItem>
                            <MenuItem onClick={() => { setSortBy('name'); setSortMenuAnchor(null); }}>
                                Name (A-Z)
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Box>

            {wishlist.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <FavoriteBorder sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                        Your wishlist is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Add items you like to your wishlist. Review them anytime and easily move them to cart.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/products')}>
                        Continue Shopping
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {sortedWishlist.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* Selection checkbox */}
                                <Checkbox
                                    checked={selectedItems.includes(product._id)}
                                    onChange={() => handleSelectItem(product._id)}
                                    sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1, bgcolor: 'rgba(255,255,255,0.9)' }}
                                />

                                {/* Delete button */}
                                <IconButton
                                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', zIndex: 1 }}
                                    onClick={() => handleRemove(product._id)}
                                    size="small"
                                >
                                    <Delete color="error" />
                                </IconButton>
                                
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.ImageURL}
                                    alt={product.productname}
                                    sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                />
                                
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography 
                                        variant="h6" 
                                        component="div" 
                                        noWrap 
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        {product.productname}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating value={product.rating || 0} readOnly size="small" />
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                            ({product.reviewCount || 0})
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="h6" color="primary" mb={1}>
                                        ₹{product.price}
                                    </Typography>
                                    
                                    {product.stock !== undefined && (
                                        <Chip 
                                            label={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                            size="small"
                                            color={product.stock > 0 ? 'success' : 'error'}
                                            variant="outlined"
                                        />
                                    )}
                                </CardContent>
                                
                                <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<MoveDown />}
                                        onClick={() => handleMoveToCart(product)}
                                        disabled={product.stock === 0}
                                        sx={{ borderRadius: 1.5 }}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                                    </Button>
                                    
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        fullWidth
                                        startIcon={<FlashOn />}
                                        onClick={() => handleBuyNow(product)}
                                        disabled={product.stock === 0}
                                        sx={{ bgcolor: '#fa8900', borderRadius: 1.5, '&:hover': { bgcolor: '#e67e00' } }}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Wishlist;
