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
import CreateTicket from '../Components/Support/CreateTicket';
import TrackOrder from './TrackOrder';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [supportDialogOpen, setSupportDialogOpen] = useState(false);
    const [selectedOrderForSupport, setSelectedOrderForSupport] = useState(null);
    const [trackDialogOpen, setTrackDialogOpen] = useState(false);
    const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

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
                text: "Your order status has been updated to Cancelled.",
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

  const handleSupportClick = (orderId) => {
    setSelectedOrderForSupport(orderId);
    setSupportDialogOpen(true);
  };

  const handleTrackClick = (order) => {
    setSelectedOrderForTracking(order);
    setTrackDialogOpen(true);
  };

  const handleDownloadInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.productname}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1976d2; }
            .invoice-info { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            th { background: #f8f9fa; text-align: left; padding: 12px; border-bottom: 2px solid #eee; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .totals { margin-top: 40px; text-align: right; font-size: 18px; }
            .grand-total { font-weight: bold; color: #1976d2; font-size: 24px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer; background: #1976d2; color: white; border: none; border-radius: 4px;">Print / Save as PDF</button>
          </div>
          <div class="header">
            <div class="logo">V-CART</div>
            <div class="invoice-info">
              <strong>INVOICE</strong><br>
              Order: #${order._id.toUpperCase()}<br>
              Date: ${new Date(order.date).toLocaleDateString()}
            </div>
          </div>
          <div style="margin-top: 20px;">
            <strong>Shipping To:</strong><br>
            ${order.shippingInfo?.name || 'Customer'}<br>
            ${order.shippingInfo?.address || 'N/A'}<br>
            ${order.shippingInfo?.city || ''}, ${order.shippingInfo?.zipCode || ''}
          </div>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="totals">
            <div>Subtotal: ₹${order.total}</div>
            <div class="grand-total">Total: ₹${order.total}</div>
          </div>
        </body>
      </html>
    `;
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
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
                                    Price: ₹{val.price}
                                </Typography>
                            </div>
                        </div>
                    ))}
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                         <Typography variant="h6">
                            Total: ₹{order.total}
                         </Typography>
                         <div className='d-flex gap-2'>
                            <Button size="small" variant='contained' onClick={() => handleTrackClick(order)}>Track Order</Button>
                            <Button size="small" variant='outlined' color="primary" onClick={() => handleDownloadInvoice(order)}>Invoice</Button>
                            <Button size="small" variant='outlined' color="primary" onClick={() => handleSupportClick(order._id)}>Support</Button>
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
    <CreateTicket 
        open={supportDialogOpen} 
        onClose={() => setSupportDialogOpen(false)} 
        orderId={selectedOrderForSupport}
    />
    <TrackOrder 
        open={trackDialogOpen} 
        onClose={() => setTrackDialogOpen(false)} 
        order={selectedOrderForTracking}
    />
  </Container>
  )
}

export default Orders