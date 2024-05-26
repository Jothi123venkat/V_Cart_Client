import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';


const Products = () => {
 
 const[data,setData]=useState();
  useEffect(() => {
    getapi();
  }, []);

  const getapi = () => {
    axios
      .get("http://localhost:5000/", data)
      .then((result) => {
        console.log(result.data);
        setData(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const[cart,setCart]=useState([])
  const handlecart = (val) => {
    console.log(val);
    axios.post("http://localhost:5000/cart/addcart",val).then((result) => {
       console.log(result.data,"cartpost");
       Swal.fire(`${result.data.productname} is Added in Cart`);
    }).catch((err) => {
        console.log(err);
    });
  };

  return (
      <div className=' d-flex flex-wrap   justify-content-around  mt-4 '>
{data && data.map((val)=>(
    <>
                 <Card sx={{ maxWidth: 345 ,marginTop:"20px" }}>
      <CardMedia
        sx={{ height: 220 ,width:300}}
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
        <Typography gutterBottom variant="h5" color="text.secondary" className=' mt-3 '>
         
        {` Price : ${val.price}`}
        </Typography>
       
      </CardContent>
      <CardActions>
        <Button size="small" variant='contained'>Buy Now</Button>
        <Button size="small" variant='contained' onClick={()=>handlecart(val)} >Add to Cart</Button>
      </CardActions>
    </Card>
    </>
))}
      </div>
  )
}

export default Products