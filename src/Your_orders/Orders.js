import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import Swal from 'sweetalert2';

const Orders = () => {

    useEffect(() => {
      getapi();
    }, [])
    
    const[data,setData]=useState("")
  
     const getapi = ()=>{
          axios.get("http://localhost:5000/cart/getcart").then((result) => {
             console.log(result.data);
             setData(result.data)
          }).catch((err) => {
             console.log(err);
          });
     }

     const getYesterdayDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1); // Subtract one day
        return date.toDateString(); // Convert to readable format
    }

    const yesterdayDate = getYesterdayDate();

    const CancelOrder = (id) => {
      Swal.fire({
        title: "Are you sure you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:5000/cart/deletecart/${id}`)
            .then((response) => {
              console.log(response.data);
    
              if (response.data) {
                Swal.fire({
                  title: "Order Cancelled..!",
                  text: "Your money will be refunded soon.",
                  icon: "success"
                });
                getapi();  
              }
            })
            .catch((error) => {
              console.error("There was an error deleting the order:", error);
              Swal.fire({
                title: "Error!",
                text: "There was an issue cancelling your order. Please try again.",
                icon: "error"
              });
            });
        }
      });
    };
    

  return (
  <Container>
     <h1 className=' fw-bolder mt-3'>Your Orders........</h1>

    {data.length ? (<>
    
      <div className=' d-flex flex-column justify-content-center mt-4 '>
{ data && data.map((val)=>(

      <Container className=' mt-3 mb-5'>
          <Card sx={{ maxWidth: 1100 }}>
        <CardMedia
          sx={{ height: 50 ,width: 50}}
          image={val.ImageURL}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {val.productname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
           {`Ordered on : ${yesterdayDate}`}
          </Typography>
        </CardContent>
     <div className=' d-flex justify-content-end gap-4 mb-4  container'>
     <Button size="small" variant='contained'>Trackorder</Button>
          <Button size="small" variant='contained' onClick={()=>CancelOrder(val._id)}>CancelOrder</Button>
     </div>
        {/* <CardActions>
      
        </CardActions> */}
      </Card>
      </Container>
  
))}
    </div>
    
    </>):(<>
      <div
              style={{ marginTop: "20%" }}
              className=" d-flex  justify-content-center align-items-center"
            >
              <h2>No Orders Found</h2>
              <div>
                <ShoppingCart style={{ fontSize: "80px" }} />
              </div>
            </div>
    </>)}

  </Container>
  )
}

export default Orders