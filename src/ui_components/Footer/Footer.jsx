import React from 'react'
import './Footer.css'
import logo from '../../assets/logo.png'

const Footer = () => {
  return (
    <div className='Footer'>
      <div className='footer-content'>
        
        <div className='footer-left'>
          <img src={logo} alt="Forever Logo" />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className='footer-column'>
          <h3>COMPANY</h3>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div className='footer-column'>
          <h3>GET IN TOUCH</h3>
          <ul>
            <li>+1-000-000-0000</li>
            <li>Foverever@contact.com</li>
            <li><a href="/">Instagram</a></li>
          </ul>
        </div>

      </div>

      <hr />
      <p className="footer-bottom">Copyright 2025 © By Waild , Kareem , 3zo , H and Mazen  - All Right Reserved.</p>
    </div>
  )
}

export default Footer;
