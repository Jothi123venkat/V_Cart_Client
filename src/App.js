import React from 'react'
import Home from './Components/Main/Home'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/NavBar/Navbar'
import Products from './Components/Productpage/Products'
import Addproduct from './Components/AddProduct/Addproduct'
import Cart from './Components/Cart/Cart'

const App = () => {
  return (
    <div>
        <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/cart" element={<Cart />} />


      </Routes>
      
    </div>
  )
}

export default App