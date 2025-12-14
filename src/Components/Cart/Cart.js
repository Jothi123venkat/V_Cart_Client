import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Delete, ShoppingCart } from "@mui/icons-material";
import { Container, CircularProgress } from "@mui/material";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCartDelete = (val) => {
    removeFromCart(val._id);
  };

  const handlePlaceOrder = () => {
    if(!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { items: cartItems, isBuyNow: false } });
  };

  return (
    <Container>
      <div className="container">
        <h5 className=" mt-3  mb-5">Items in Cart : {cartItems.length}</h5>
        <div className=" mt-2  mb-3  d-flex  justify-content-center  text-primary "></div>
        {cartItems && cartItems.length > 0 ? (
          <>
            {cartItems.map((val, index) => (
              <Card
                key={val._id + index}
                sx={{
                  maxWidth: 1000,
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
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
                  <Typography gutterBottom variant="h5" color="text.secondary" className="mt-3">
                     {`Price: $${val.price}`} 
                  </Typography>
                </CardContent>
                <CardActions className="">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleCartDelete(val)}
                    color="error"
                  >
                    <Delete />
                  </Button>
                </CardActions>
              </Card>
            ))}
            <div className="mt-4">
              <Typography variant="h5" className="d-flex justify-content-end mb-3">
                 Total: ${cartItems.reduce((acc, item) => acc + Number(item.price), 0)}
              </Typography>
              <div className=" mt-4 d-flex justify-content-end  mb-5">
                <Button 
                  variant="contained" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Place Order"}
                </Button>
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

