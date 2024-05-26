import { Grid } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const Banner = () => {
  return (
    <div className=" container ">
    
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: "30px" }}
      >
        <Grid item lg={6}  md ={6} sm={12} xs={12}>
      <img
            src="./Assets/BannerImg.png"
            alt="img"
            style={{  width:"100%" , maxWidth: "600px" }}
          />
          
        </Grid>

        <Grid item  lg={6}  md ={6} sm={12} xs={12}sx={{ fontWeight: "bolder" }}>
            <h1>V-CART <AirplanemodeActiveIcon style={{fontSize:"40px"}}/></h1>
          <h1>START A SHOPPING WITH US</h1>
          <p>
            Explore a world of endless possibilities with V-Cart, the only
             place to discover and shop for all your favorite items.
          </p>
 
          <Button>Explore now</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Banner;
