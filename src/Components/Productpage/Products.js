import React, { useEffect, useState } from 'react';
import { 
  Card, CardContent, CardMedia, CardActions, Button, Typography, 
  Grid, Container, Box, Checkbox, FormControlLabel, Slider, 
  Rating, Divider, TextField, Chip, IconButton, Tooltip,
  useTheme, alpha, Skeleton
} from '@mui/material';
import { 
  Search, Inventory2, Favorite, FavoriteBorder, FilterList, 
  FlashOn, ShoppingCart, GridView, ViewList, Close 
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const Products = () => {
  const theme = useTheme();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filters
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  // Derived Categories
  const categories = [...new Set(products.map(p => (p.category || 'Uncategorized').trim()))].filter(Boolean).sort();

  useEffect(() => {
    const query = searchParams.get("keyword") || "";
    const categoryParam = searchParams.get("category");
    setKeyword(query);
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters(keyword, priceRange, selectedCategories, minRating);
  }, [keyword, priceRange, selectedCategories, minRating, products]);

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

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(p => 
        p.productname.toLowerCase().includes(lower) || 
        p.productdescription.toLowerCase().includes(lower)
      );
    }

    result = result.filter(p => p.price >= price[0] && p.price <= price[1]);

    if (cats.length > 0) {
      result = result.filter(p => cats.includes(p.category || 'Uncategorized'));
    }

    if (rating > 0) {
      result = result.filter(p => (p.rating || 0) >= rating);
    }

    setFilteredData(result);
  };

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();
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
    } catch (err) {
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
    if (keyword.trim()) {
      setSearchParams({ keyword });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
    setMinRating(0);
    setSearchParams({});
    setKeyword("");
  };

  // Skeleton Loader
  const ProductSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" height={24} width="60%" />
        <Skeleton variant="text" height={28} width="40%" />
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" height={36} width="100%" />
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <ProductSkeleton />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar Filters */}
        <Grid 
          item 
          xs={12} 
          md={3}
          sx={{ 
            display: { xs: showFilters ? 'block' : 'none', md: 'block' }
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 90,
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'light'
                ? '0 4px 12px rgba(0, 0, 0, 0.05)'
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList /> Filters
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setShowFilters(false)}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <Close />
              </IconButton>
            </Box>
            
            {/* Price Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, val) => setPriceRange(val)}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                sx={{
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20,
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Chip label={`₹${priceRange[0]}`} size="small" />
                <Chip label={`₹${priceRange[1]}+`} size="small" />
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Category Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
                Category
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {categories.map(cat => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox 
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        size="small"
                      />
                    }
                    label={cat}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Rating Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
                Customer Rating
              </Typography>
              {[4, 3, 2, 1].map(star => (
                <Box 
                  key={star} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: minRating === star ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                  onClick={() => setMinRating(star)}
                >
                  <Rating value={star} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>& Up</Typography>
                </Box>
              ))}
            </Box>

            <Button 
              variant="outlined" 
              fullWidth 
              onClick={clearFilters}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {filteredData.length} Products
              </Typography>
              {selectedCategories.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  {selectedCategories.map(cat => (
                    <Chip 
                      key={cat}
                      label={cat}
                      size="small"
                      onDelete={() => handleCategoryChange(cat)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowFilters(true)}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <FilterList />
              </Button>
              <TextField
                size="small"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ width: { xs: '100%', sm: 200 } }}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ minWidth: 'auto', px: 2 }}>
                <Search />
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <IconButton 
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridView />
              </IconButton>
              <IconButton 
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {filteredData.length > 0 ? (
              filteredData.map((val) => (
                <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={val._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: viewMode === 'grid' ? 'column' : 'row',
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.palette.mode === 'light'
                          ? '0 12px 32px rgba(0, 0, 0, 0.12)'
                          : '0 12px 32px rgba(0, 0, 0, 0.5)',
                        '& .product-image': {
                          transform: 'scale(1.05)',
                        },
                      },
                    }}
                    onClick={() => navigate(`/product/${val._id}`)}
                  >
                    {/* Wishlist Button */}
                    <Tooltip title={wishlist.includes(val._id) ? "Remove from Wishlist" : "Add to Wishlist"}>
                      <IconButton 
                        sx={{ 
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 2,
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                            transform: 'scale(1.1)',
                          }
                        }}
                        onClick={(e) => handleToggleWishlist(e, val._id)}
                      >
                        {wishlist.includes(val._id) ? 
                          <Favorite sx={{ color: 'error.main' }} /> : 
                          <FavoriteBorder />
                        }
                      </IconButton>
                    </Tooltip>

                    {/* Product Image */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: viewMode === 'grid' ? '100%' : 200,
                        height: viewMode === 'grid' ? 220 : '100%',
                        overflow: 'hidden',
                        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2a2a2a',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={val.ImageURL}
                        alt={val.productname}
                        className="product-image"
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 2,
                          transition: 'transform 0.3s ease',
                        }}
                      />
                      {val.stock === 0 && (
                        <Chip
                          label="Out of Stock"
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                          }}
                        />
                      )}
                    </Box>

                    {/* Product Info */}
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="div" 
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 1,
                        }}
                      >
                        {val.productname}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Rating value={val.rating || 0} readOnly size="small" precision={0.5} />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({val.reviewCount || 0})
                        </Typography>
                      </Box>
                      
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                        ₹{val.price.toLocaleString()}
                      </Typography>
                      
                      {val.stock !== undefined && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: val.stock > 0 ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          {val.stock > 0 ? `${val.stock} in stock` : 'Currently Unavailable'}
                        </Typography>
                      )}
                    </CardContent>

                    {/* Action Buttons */}
                    <CardActions sx={{ p: 2.5, pt: 0, flexDirection: 'column', gap: 1 }}>
                      <Button 
                        size="medium"
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(val);
                        }}
                        disabled={val.stock === 0}
                        sx={{ borderRadius: 2 }}
                      >
                        {val.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <Button 
                        size="medium"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<FlashOn />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(val);
                        }}
                        disabled={val.stock === 0}
                        sx={{ borderRadius: 2 }}
                      >
                        {val.stock === 0 ? "Out of Stock" : "Buy Now"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 10,
                  px: 2,
                }}>
                  <Inventory2 sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your filters or search terms
                  </Typography>
                  <Button variant="contained" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
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
