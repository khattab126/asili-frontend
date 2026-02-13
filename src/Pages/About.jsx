import React from 'react'
import '../style/About.css'
import  about_img  from '../assets/about_img.png';
const About = () => {
  return (
    <div>
      <div className='about_title'>
        <h1>ABOUT US</h1> 
      </div>

      <div className='About_content'>
        <img className='about_img' src={about_img} alt='' />
        <div className='ss'>
          <p>Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
          <b className='ourmission'>Our Mission</b>
          <p>Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
        </div>
      </div>

      <div className='why_us'>
        <h2>WHY choose us</h2>
      </div>

      <div className='reasons'>
        <div className='qualtiy_assurance'>
          <b>Quality Assurance:</b>
          <p>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className='convenience'>
          <b>Convenience:</b>
          <p>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className='Customer_Service'>
          <b>Exceptional Customer Service:</b>
          <p>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>
      </div>
      
    </div>
  )
}

export default About