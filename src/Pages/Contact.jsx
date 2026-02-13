import React from 'react';
import { assets } from '../assets/assets';
import '../style/Contact.css'; // ← include this CSS file

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-title-wrapper">
        <h1>CONTACT US</h1>
      </div>

      <div className="contact-content">
        <img className="contact-image" src={assets.contact_img} alt="" />
        <div className="contact-details">
          <p className="section-heading">Our Store</p>
          <p className="section-text">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className="section-text">
            Tel: (415) 555-0132 <br /> Email: admin@forever.com
          </p>
          <p className="section-heading">Careers at Forever</p>
          <p className="section-subtext">
            Learn more about our teams and job openings.
          </p>
          <button className="explore-button">Explore Jobs</button>
        </div>
      </div>

    </div>
  );
};

export default Contact;
