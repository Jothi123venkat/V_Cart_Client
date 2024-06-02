import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Delete, ShoppingCart } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Container } from "@mui/material";
import Swal from "sweetalert2";

const Cart = ({cartItem,setCartItem}) => {


  const handleCartDelete =(val)=>{
     const DeleteItem = cartItem.filter((item)=>item._id !== val._id);
      setCartItem(DeleteItem);
      localStorage.setItem("VJ_cart",JSON.stringify(DeleteItem));
  }

  useEffect(() => {
   const CartFromStorage = JSON.parse(localStorage.getItem("VJ_cart"));
   setCartItem(CartFromStorage)
  }, [])
  
  const handlePlaceOrder =()=>{
    axios.post("http://localhost:5000/cart/addcart",cartItem).then((result) => {
      console.log(result.data);
      setCartItem([]);
      localStorage.setItem("VJ-cart", JSON.stringify([]));
      Swal.fire({
       title: "Order Placed!",
       text: "You order will be dispatched soon",
       icon: "success"
     });
    }).catch((err) => {
       console.log(err); 
    });
   //  addcart
}

  return (
 <Container>

<div className="container">
      <h5 className=" mt-3  mb-5">Items in Cart : {cartItem.length}</h5>
      <div className=" mt-2  mb-3  d-flex  justify-content-center  text-primary "></div>
      {cartItem && cartItem.length > 0 ? (
        <>
          {cartItem.map((val, index) => (
            <Card
              key={val._id}
              sx={{
                maxWidth: 1000,
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap:"wrap"
              }}
            >
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
                <Typography
                  gutterBottom
                  variant="h5"
                  color="text.secondary"
                  className=" mt-3 "
                >
                  {/* {` Price : ${val.price * counts[index]}`} */}
                </Typography>
              </CardContent>
              <CardActions className="">
              
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleCartDelete(val)}
                >
                  <Delete />
                </Button>
             
              </CardActions>
            </Card>
          ))}
          <div className="mt-4">
            {/* <Typography variant="h5" color="text.secondary" className=" d-flex justify-content-center">
              {`Total Amount: ${cart.reduce((previousvalue, val, index) => {
                return previousvalue + val.price * counts[index];
              }, 0)}`}
             
            </Typography> */}
            <div className=" mt-4 d-flex justify-content-end  mb-5">
                <Button variant="contained" onClick={handlePlaceOrder}>PlaceOrder</Button>
              </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{ marginTop: "20%" }}
            className=" d-flex  justify-content-center align-items-center"
          >
            <h2>Your Cart is empty</h2>
            <div>
              <ShoppingCart style={{ fontSize: "80px" }} />
            </div>
          </div>
        </>
      )}
    </div>

 </Container>
  );
};

export default Cart;
