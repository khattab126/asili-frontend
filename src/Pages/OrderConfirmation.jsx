import React, { useState, useContext } from 'react';
import '../style/OrderConfirmation.css';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { BsBag } from 'react-icons/bs';
import { ShopContext } from '../context/ShopContext';

const OrderConfirmation = () => {
  const [email, setEmail] = useState('');
  const { navigate } = useContext(ShopContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <div className="icon-container">
          <BsBag size={40} />
        </div>
        
        <h1>Thank you!</h1>
        
        <div className="confirmation-text">
          <p>A confirmation has been sent to your email.</p>
          <p>Since you're here, join our list for discounts!</p>
        </div>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Yes, Sign Me Up!</button>
        </form>

        <div className="view-orders-button">
          <button onClick={() => navigate('/orders')}>View My Orders</button>
        </div>

        <div className="social-section">
          <p>Let's Be Friends!</p>
          <div className="social-icons">
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 