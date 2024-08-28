import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Products = ({ cartItem, setCartItem }) => {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    getApi();
  }, [searchParams]);

  const getApi = () => {
    axios
      .get(`http://localhost:5000/?${searchParams.toString()}`)
      .then((result) => {
        console.log(result.data);
        if (Array.isArray(result.data)) {
          setData(result.data);
        } else {
          console.error('API response is not an array', result.data);
          setData([]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCart = (val) => {
    console.log(val);
    const itemExist = cartItem.find((item) => item._id === val._id);
    if (!itemExist) {
      const updatedCartItem = [...cartItem, val];
      setCartItem(updatedCartItem);
      localStorage.setItem("VJ_cart", JSON.stringify(updatedCartItem));
      Swal.fire({
        title: "Thank You!",
        text: `${val.productname} Added to Cart `,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: `${val.productname} Already Added to Cart`,
        icon: "warning",
      });
    }
  };

  const handleSearch = () => {
    setSearchParams({ keyword });
    setKeyword("");
  };

  return (
    <div>
      <div className='d-flex justify-content-center mt-3'>
        <TextField
          size='small'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder='Search items...'
        />
        <Button variant='contained' onClick={handleSearch}>
          <Search />
        </Button>
      </div>
      <div className='d-flex flex-wrap justify-content-around mt-4'>
        {data.length > 0 ? (
          data.map((val) => (
            <Card sx={{ maxWidth: 345, marginTop: "20px" }} key={val._id}>
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
                <Typography gutterBottom variant="h5" color="text.secondary" className='mt-3'>
                  {`Price: ${val.price}`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant='contained'>Buy Now</Button>
                <Button size="small" variant='contained' onClick={() => handleCart(val)}>Add to Cart</Button>
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
