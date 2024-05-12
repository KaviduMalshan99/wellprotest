import React from 'react'
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import './AboutUs.css'
import Body from '../../Body/Body'



function AboutUs() {
  return (
    <>
    <div id="wrapper">
      <Header/>
      <Body>
          <h1 id="h1">About Us</h1>
          <br></br>
          
          <div  id="image1">

              <img src="AboutUs.jpg"  width="97%" height="20%" alt ="AboutUs"/>
          </div>
          <br></br>
          <div>
          Welcome to WELL WORN where fashion meets individuality. Our vision is to redefine your style journey by offering a curated selection of bags and shoes that empower you to express yourself effortlessly.
          </div>
          <br></br>
          <div>
            <h1>Convenience</h1>
            <br></br>
            <p>At WELL WORN convenience is key. Our user-friendly website allows you to browse, choose, and purchase your favorite styles with ease.
               Enjoy a seamless shopping experience from the comfort of your home, because looking good should be as effortless as possible.</p>
          </div>
          <br></br>
          <div>
            <h1>Quality</h1>
            <br></br>
            <p>Crafted with precision and a commitment to excellence, our products boast top-notch quality.
               We believe that every purchase from WELL WORN should be an investment in durable and timeless
                accessories that stand out in both style and substance.</p>
          </div>
          <br></br>
      </Body>
      <Footer/>
       
     
      </div>

    </>

  )
}

export default AboutUs