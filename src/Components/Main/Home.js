import React from 'react'
import Banner from '../Banner/Banner'
import Navbar from '../NavBar/Navbar'
import About from '../AboutUs/About'
import Categories from '../Categories/Categories'
import Contactus from '../Contact/Contactus'
import BannerCarousel from '../Banner/BannerCarousel'
import FlashSales from '../FlashSales/FlashSales'

const Home = () => {
  


  return (
    <div>
      <BannerCarousel />
      <FlashSales />
      <Banner />
      <About />
      <Categories />
      <Contactus />
    </div>
  )
}

export default Home