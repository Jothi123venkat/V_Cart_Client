import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Delete, ShoppingCart } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [cartlength, setCartlength] = useState(0);
    const [counts, setCounts] = useState([]);
    const[clickedindex,setClickedindex]=useState("")
    const { handleSubmit, setValue } = useForm();

    useEffect(() => {
        getCart();
    }, []);

    const getCart = () => {
        axios.get("http://localhost:5000/cart/getcart")
            .then((result) => {
                setCart(result.data);
                setCartlength(result.data.length);
                // Initialize counts array with counts for each item set to 0
                setCounts(Array(result.data.length).fill(1));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCartDelete = (id) => {
        axios.delete(`http://localhost:5000/cart/deletecart/${id}`)
            .then(() => {
                // Remove item from cart and its corresponding count from counts
                setCart(cart.filter(item => item._id !== id));
                setCounts(counts.filter((_, index) => index !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCartIncrement = (index) => {
      setClickedindex(index)

        const Prevcounts = [...counts];
        console.log(Prevcounts,"updatedcounts");
        Prevcounts[clickedindex]++;
        setCounts(Prevcounts);
    };

    const handleCartDecrement = (index) => {
        if (counts[index] > 1) {
            const Prevcounts = [...counts];
            Prevcounts[index]--;
            setCounts(Prevcounts);
        }
    };

    return (
        <div className='container'>
            <h5 className=' mt-3  mb-5'>Items in Cart : {cartlength}</h5>
            <div className=' mt-2  mb-3  d-flex  justify-content-center  text-primary '>
            </div>
            {cart && cart.length > 0 ? (
                <>
                    {cart.map((val, index) => (
                        <Card key={val._id} sx={{ maxWidth: 1000, marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
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
                                <Typography gutterBottom variant="h5" color="text.secondary" className=' mt-3 '>
                                    {` Price : ${val.price * counts[index]}`}
                                </Typography>
                            </CardContent>
                            <CardActions className=''>
                                <Button size="small" variant='contained'>Buy Now</Button>
                                <Button size="small" variant='contained' onClick={() => handleCartDelete(val._id)}><Delete /></Button>
                                <Button variant='contained' onClick={() => handleCartIncrement(index)}>+</Button>
                                <p>{counts[index]}</p>
                                <Button variant='contained' onClick={() => handleCartDecrement(index)}>-</Button>
                            </CardActions>
                        </Card>
                    ))}
                </>
            ) : (
                <>
                    <div style={{ marginTop: "20%" }} className=' d-flex  justify-content-center align-items-center'>
                        <h2>Your Cart is empty</h2>
                        <div><ShoppingCart style={{ fontSize: "80px" }} /></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
