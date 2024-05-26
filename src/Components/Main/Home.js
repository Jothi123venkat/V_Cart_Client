import React from 'react'
import Banner from '../Banner/Banner'
import Navbar from '../NavBar/Navbar'
import About from '../AboutUs/About'
import Categories from '../Categories/Categories'
import Contactus from '../Contact/Contactus'

const Home = () => {
  return (
    <div>
    {/* <Navbar/> */}
    <Banner/>
    <About/>
    <Categories/>
    <Contactus/>
    </div>
  )
}

export default Home