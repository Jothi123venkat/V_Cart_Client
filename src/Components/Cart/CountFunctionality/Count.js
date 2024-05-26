import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Count = () => {
  const [count, setCount] = useState(0);
  console.log(count);

  useEffect(() => {
      getcart();
  }, [])
  
  const[cart,setCart]=useState(0);
  const[price,setPrice]=useState("");

  const getcart =()=>{
    axios.get("http://localhost:5000/cart/getcart").then((result) => {
          console.log(result);
          setCart(result.data)
          setPrice(result.data[0].price)
        

    }).catch((err) => {
         console.log(err);
    });
}


  const handlecartincrement = () => {
    
    setCount(count + 1);
    
  };

  const handlecartdecrement = () => {
    if(count> 0){
    setCount(count - 1);
    }
  };
  return (
    <div>
      <Button variant="contained" onClick={handlecartincrement}>
        +
      </Button>
      <p className=" d-flex  flex-column  justify-content-center  align-items-center mt-3   ">{price}</p>

      <Button variant="contained" onClick={handlecartdecrement}>
        -
      </Button>
    </div>
  );
};

export default Count;
