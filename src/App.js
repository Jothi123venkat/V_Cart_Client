import React, { useState } from 'react'
import Home from './Components/Main/Home'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/NavBar/Navbar'
import Products from './Components/Productpage/Products'
import Addproduct from './Components/AddProduct/Addproduct'
import Cart from './Components/Cart/Cart'
import Orders from './Your_orders/Orders'

const App = () => {
  const[cartItem,setCartItem]=useState([]);
  return (
    <div>
        <Navbar  cartItem={cartItem} setCartItem={setCartItem}/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Products/>} />
        <Route path="/Yourorders" element={<Orders />} />
        <Route path="/products" element={<Products cartItem={cartItem} setCartItem={setCartItem}/>} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/cart" element={<Cart cartItem={cartItem} setCartItem={setCartItem} />} />


      </Routes>
      
    </div>
  )
}

export default App