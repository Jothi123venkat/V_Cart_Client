import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField, Chip, Rating, Box } from '@mui/material';
import { Search, Inventory2, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
 import { IconButton, Tooltip } from '@mui/material'; 

const Products = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const query = searchParams.get("keyword") || "";
    if (query) {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(p => 
        p.productname.toLowerCase().includes(lowerQuery) ||
        p.productdescription.toLowerCase().includes(lowerQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(products);
    }
  }, [searchParams, products]);

  useEffect(() => {
    if (isAuthenticated) {
        fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
        const token = localStorage.getItem('vcart_token');
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.user.profile}`, {
             headers: { 'x-auth-token': token }
        });
        // Assuming profile returns populated wishlist or array of IDs. 
        // Based on User model, it stores ObjectIds. Profile might return populated or not.
        // Let's assume we map to IDs for checking status
        const ids = res.data.wishlist.map(w => typeof w === 'object' ? w._id : w);
        setWishlist(ids);
    } catch (err) {
        console.error("Wishlist load error", err);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    try {
        const token = localStorage.getItem('vcart_token');
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.user.wishlist}/${productId}`, {}, {
            headers: { 'x-auth-token': token }
        });
        // Update local state toggle
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
        } else {
            setWishlist([...wishlist, productId]);
        }
    } catch(err) {
        console.error("Wishlist toggle fail", err);
    }
  };


  const handleSearch = () => {
    if(keyword.trim()) {
      setSearchParams({ keyword });
    } else {
      setSearchParams({});
    }
    setKeyword("");
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { items: [product], isBuyNow: true } });
  };

  if (loading) return <div className="text-center mt-5">Loading Products...</div>;

  return (
    <div>
      <div className='d-flex justify-content-center mt-3'>
        <TextField
          size='small'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder='Search items...'
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant='contained' onClick={handleSearch}>
          <Search />
        </Button>
      </div>
      <div className='d-flex flex-wrap justify-content-around mt-4'>
        {filteredData.length > 0 ? (
          filteredData.map((val) => (
            <Card sx={{ maxWidth: 345, marginTop: "20px", position: 'relative' }} key={val._id}>
              <Tooltip title={wishlist.includes(val._id) ? "Remove from Wishlist" : "Add to Wishlist"}>
                  <IconButton 
                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)' }}
                    onClick={() => handleToggleWishlist(val._id)}
                  >
                      {wishlist.includes(val._id) ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
              </Tooltip>
              <CardMedia
                sx={{ height: 220, width: 300 }}
                image={val.ImageURL}
                title={val.productname}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {val.productname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {val.productdescription}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Rating value={val.rating || 0} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    ({val.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" className="mt-2">
                  ${val.price}
                </Typography>
                {val.stock !== undefined && (
                  <Chip 
                    icon={<Inventory2 />}
                    label={val.stock > 0 ? `In Stock (${val.stock})` : 'Out of Stock'}
                    color={val.stock > 0 ? 'success' : 'error'}
                    size="small"
                    className="mt-2"
                  />
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant='contained' 
                  onClick={() => handleBuyNow(val)}
                  disabled={val.stock === 0}
                >
                  Buy Now
                </Button>
                <Button 
                  size="small" 
                  variant='contained' 
                  onClick={() => addToCart(val)}
                  disabled={val.stock === 0}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="h6">No products found</Typography>
        )}
      </div>
    </div>
  );
}

export default Products;
