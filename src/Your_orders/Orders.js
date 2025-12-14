import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Box, Chip } from '@mui/material';
import { ShoppingCart, CheckCircle, LocalShipping, Cancel } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadOrders();
    }, []);
    
    const loadOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('vcart_token');
            const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders.mine}`, {
                headers: { 'x-auth-token': token }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const CancelOrder = (id) => {
      Swal.fire({
        title: "Are you sure you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('vcart_token');
                await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.orders.cancel(id)}`, {
                    headers: { 'x-auth-token': token }
                });
                Swal.fire({
                    title: "Order Cancelled!",
                text: "Your order has been removed.",
                icon: "success"
            });
            loadOrders();
            } catch (err) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to cancel order.",
                    icon: "error"
                });
            }
        }
      });
    };

  const getStatusIcon = (status) => {
    const icons = {
      'Processing': <ShoppingCart />,
      'Shipped': <LocalShipping />,
      'Delivered': <CheckCircle />,
      'Cancelled': <Cancel />
    };
    return icons[status] || <ShoppingCart />;
  };
    
  if(loading) return <div className="text-center mt-5">Loading Orders...</div>;

  return (
  <Container>
     <h1 className=' fw-bolder mt-3'>Your Orders</h1>

    {orders.length > 0 ? (
      <div className=' d-flex flex-column justify-content-center mt-4 '>
        {orders.map((order) => (
           <Container className=' mt-3 mb-5' key={order._id}>
                <Card sx={{ maxWidth: 1100, padding: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Order #{order._id.substring(0, 10)}
                        </Typography>
                        <Chip 
                            icon={getStatusIcon(order.status)}
                            label={order.status} 
                            color={order.status === 'Processing' ? 'warning' : order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'error'}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" className="mb-3">
                        Placed on: {new Date(order.date).toLocaleString()}
                    </Typography>
                    
                    {order.items.map((val) => (
                        <div key={val._id} className="d-flex mb-3 align-items-center gap-3 border-bottom pb-2">
                            <img 
                                src={val.ImageURL} 
                                alt={val.productname} 
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                            />
                            <div>
                                <Typography variant="subtitle1" component="div">
                                    {val.productname}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: ${val.price}
                                </Typography>
                            </div>
                        </div>
                    ))}
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                         <Typography variant="h6">
                            Total: ${order.total}
                         </Typography>
                         <div className='d-flex gap-2'>
                            <Button size="small" variant='contained'>Track Order</Button>
                            <Button size="small" variant='outlined' color="error" onClick={()=>CancelOrder(order._id)}>Cancel Order</Button>
                        </div>
                    </div>
                </Card>
           </Container>
        ))}
      </div>
    ) : (
      <div
            style={{ marginTop: "10%" }}
            className=" d-flex flex-column justify-content-center align-items-center"
      >
        <h2>No Orders Found</h2>
        <div>
           <ShoppingCart style={{ fontSize: "80px", color: '#ccc' }} />
        </div>
      </div>
    )}
  </Container>
  )
}

export default Orders