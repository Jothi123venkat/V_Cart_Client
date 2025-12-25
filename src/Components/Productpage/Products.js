 

import React, { useEffect, useState } from 'react';
import { 
  Card, CardContent, CardMedia, CardActions, Button, Typography, 
  Grid, Container, Box, Checkbox, FormControlLabel, Slider, 
  Rating, Divider, TextField, Chip, IconButton, Tooltip 
} from '@mui/material';
import { Search, Inventory2, Favorite, FavoriteBorder, FilterList, FlashOn, ShoppingCart } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const Products = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  
  // Filters
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(0);

  // Derived Categories
  const categories = [...new Set(products.map(p => (p.category || 'Uncategorized').trim()))].filter(Boolean).sort();

  useEffect(() => {
    const query = searchParams.get("keyword") || "";
    setKeyword(query);
    applyFilters(query, priceRange, selectedCategories, minRating);
  }, [searchParams, products, priceRange, selectedCategories, minRating]);

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
        const token = localStorage.getItem('vcart_token');
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.user.profile}`, {
             headers: { 'x-auth-token': token }
        });
        const ids = res.data.wishlist.map(w => typeof w === 'object' ? w._id : w);
        setWishlist(ids);
    } catch (err) {
        console.error("Wishlist load error", err);
    }
  };

  const applyFilters = (search, price, cats, rating) => {
    let result = products;

    // Search Filter
    if(search) {
        const lower = search.toLowerCase();
        result = result.filter(p => 
            p.productname.toLowerCase().includes(lower) || 
            p.productdescription.toLowerCase().includes(lower)
        );
    }

    // Price Filter
    result = result.filter(p => p.price >= price[0] && p.price <= price[1]);

    // Category Filter
    if(cats.length > 0) {
        result = result.filter(p => cats.includes(p.category || 'Uncategorized'));
    }

    // Rating Filter
    if(rating > 0) {
        result = result.filter(p => (p.rating || 0) >= rating);
    }

    setFilteredData(result);
  };

  const handleToggleWishlist = async (e, productId) => {
     e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    try {
        const token = localStorage.getItem('vcart_token');
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}/${productId}`, {}, {
            headers: { 'x-auth-token': token }
        });
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
        } else {
            setWishlist([...wishlist, productId]);
        }
    } catch(err) {
        console.error("Wishlist toggle fail", err);
    }
  };

  const handleCategoryChange = (cat) => {
      setSelectedCategories(prev => 
         prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    navigate('/checkout', { state: { items: [{ product, quantity: 1 }], isBuyNow: true } });
  };

  const handleSearch = () => {
    if(keyword.trim()) {
      setSearchParams({ keyword });
    } else {
      setSearchParams({});
    }
  };

  if (loading) return <div className="text-center mt-5">Loading Products...</div>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3} sx={{ borderRight: '1px solid #ddd' }}>
           <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Playfair Display', fontWeight: 'bold' }}><FilterList /> Filters</Typography>
           
           {/* Price Filter */}
           <Box sx={{ mb: 3 }}>
               <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Price Range</Typography>
               <Slider
                    value={priceRange}
                    onChange={(e, val) => setPriceRange(val)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={2000} // Adjust based on max product price
               />
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                   <Typography variant="body2">₹{priceRange[0]}</Typography>
                   <Typography variant="body2">₹{priceRange[1]}+</Typography>
               </Box>
           </Box>
           <Divider sx={{ mb: 2 }} />

           {/* Category Filter */}
           <Box sx={{ mb: 3 }}>
               <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Category</Typography>
               {categories.map(cat => (
                   <FormControlLabel
                       key={cat}
                       control={
                           <Checkbox 
                               checked={selectedCategories.includes(cat)}
                               onChange={() => handleCategoryChange(cat)}
                           />
                       }
                       label={cat}
                       sx={{ display: 'block' }}
                   />
               ))}
           </Box>
           <Divider sx={{ mb: 2 }} />

           {/* Rating Filter */}
           <Box sx={{ mb: 3 }}>
               <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Customer Rating</Typography>
               {[4, 3, 2, 1].map(star => (
                   <Box 
                    key={star} 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 1 }}
                    onClick={() => setMinRating(star)}
                   >
                       <Rating value={star} readOnly size="small" />
                       <Typography variant="body2" sx={{ ml: 1 }}>& Up</Typography>
                   </Box>
               ))}
           </Box>
           <Button variant="outlined" fullWidth onClick={() => {
               setPriceRange([0, 10000]);
               setSelectedCategories([]);
               setMinRating(0);
               setSearchParams({});
               setKeyword("");
           }}>
               Clear Filters
           </Button>
        </Grid>

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{filteredData.length} Results</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                     <TextField
                        size='small'
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                        placeholder='Search items...'
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant='contained' onClick={handleSearch}>
                    <Search />
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {filteredData.length > 0 ? (
                filteredData.map((val) => (
                    <Grid item xs={12} sm={6} md={4} key={val._id}>
                        <Card 
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                            onClick={() => navigate(`/product/${val._id}`)}
                        >
                            <Tooltip title={wishlist.includes(val._id) ? "Remove from Wishlist" : "Add to Wishlist"}>
                                <IconButton 
                                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 2 }}
                                    onClick={(e) => handleToggleWishlist(e, val._id)}
                                >
                                    {wishlist.includes(val._id) ? <Favorite color="error" /> : <FavoriteBorder />}
                                </IconButton>
                            </Tooltip>
                            <CardMedia
                                component="img"
                                height="200"
                                image={val.ImageURL}
                                alt={val.productname}
                                sx={{ objectFit: 'contain', p: 2 }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
                                {val.productname}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Rating value={val.rating || 0} readOnly size="small" />
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                        ({val.reviewCount || 0})
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="primary">
                                ₹{val.price}
                                </Typography>
                                {val.stock !== undefined && (
                                    <Typography variant="caption" color={val.stock > 0 ? 'success.main' : 'error.main'}>
                                        {val.stock > 0 ? 'In Stock' : 'Currently Unavailable'}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                                <Button 
                                    size="small" 
                                    variant='contained' 
                                    fullWidth
                                    startIcon={<ShoppingCart />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(val);
                                    }}
                                    disabled={val.stock === 0}
                                    sx={{ borderRadius: 1.5 }}
                                >
                                {val.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </Button>
                                <Button 
                                    size="small" 
                                    variant='contained' 
                                    color="warning"
                                    fullWidth
                                    startIcon={<FlashOn />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBuyNow(val);
                                    }}
                                    disabled={val.stock === 0}
                                    sx={{ bgcolor: '#fa8900', borderRadius: 1.5, '&:hover': { bgcolor: '#e67e00' } }}
                                >
                                {val.stock === 0 ? "Out of Stock" : "Buy Now"}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
                ) : (
                <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Inventory2 sx={{ fontSize: 60, color: '#ccc' }} />
                        <Typography variant="h6" color="text.secondary">No products match your filters</Typography>
                    </Box>
                </Grid>
                )}
            </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Products;
