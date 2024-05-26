import { Box, Grid } from "@mui/material";
import React from "react";
import { GiMeshBall } from "react-icons/gi";
import { FaHandshakeSimple } from "react-icons/fa6";
import { GiLockedBox } from "react-icons/gi";
import { LuListPlus } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
 

const Categories = () => {
  return (
    <div className=" mb-5 ">
      <div
        style={{
          background: "#1C448E",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1>CATEGORIES</h1>
      </div>

      <div className=" container ">
     <Grid
     container
      direction="row"
       justifyContent="center"
       alignItems="center"
       sx={{marginTop:"50px"}}
     >
     <Grid item lg={4} md={4} sm={12} xs={12}  className=" mt-3 ">
     <center>
     <Box sx={{width:"300px",height:"200px" ,border:"1px solid black",paddingTop:"50px"}}>
           <GiMeshBall style={{fontSize:"40px"}} />
          <div className=" mt-3 ">
          <h4>Fullfill Service</h4>
          </div>
        </Box>
     </center>


     </Grid>
     <Grid item lg={4} md={4} sm={12} xs={12} className=" mt-3 ">
     <center>
     <Box sx={{width:"300px",height:"200px" ,border:"1px solid black",paddingTop:"50px"}}>
            <FaHandshakeSimple style={{fontSize:"40px"}}/>
            <div className=" mt-3 ">
            <h4>Trust Behind</h4>

            </div>
        </Box>
     </center>

     </Grid>
     <Grid item lg={4} md={4} sm={12} xs={12}className=" mt-3 ">
     <center>
     <Box sx={{width:"300px",height:"200px" ,border:"1px solid black",paddingTop:"50px"}}>
            <GiLockedBox style={{fontSize:"40px"}}/>
            <div className=" mt-3 ">
            <h4>Strength</h4>

            </div>
        </Box>
     </center>
     </Grid>


     <Grid item lg={4} md={4} sm={12} xs={12}className=" mt-3 ">
     <center>
     <Box sx={{width:"300px",height:"200px" ,border:"1px solid black",paddingTop:"50px"}}>
            < CiHeart style={{fontSize:"40px"}}/>
            <div className=" mt-3 ">
            <h4>Care with Love</h4>

            </div>
        </Box>
     </center>
     </Grid>


     <Grid item lg={4} md={4} sm={12} xs={12}className=" mt-3 ">
     <center>
     <Box sx={{width:"300px",height:"200px" ,border:"1px solid black",paddingTop:"50px"}}>
            <FaPeopleGroup style={{fontSize:"40px"}}/>
            <div className=" mt-3 ">
            <h4>24/7 Customer Support</h4>

            </div>
        </Box>
     </center>
     </Grid>


     <Grid item lg={4} md={4} sm={12} xs={12}className=" mt-3 ">
     <center>
     <Box sx={{width:"300px",height:"200px" ,border:"1px solid black",paddingTop:"50px"}}>
            <LuListPlus style={{fontSize:"40px"}}/>
            <div className=" mt-3 ">
            <h4>Trust & Worthy </h4>

            </div>
        </Box>
     </center>
     </Grid>

     </Grid>
      </div>
    </div>
  );
};

export default Categories;
