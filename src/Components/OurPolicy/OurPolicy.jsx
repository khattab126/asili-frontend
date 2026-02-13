import React from 'react'
import { assets } from '../../assets/assets'   
import './OurPolicy.css'
const OurPolicy = () => {
  return (
    <div className='our-policy'>

      <div className="plocies">
        <img src={assets.exchange_icon} alt="" />
        <p>Easy Exchange Policy</p>
        <p>We offer hassle free exchange policy</p>
      </div>

      <div className="plocies">
        <img src={assets.quality_icon} alt="" />
        <p>7 Days Return Policy</p>
        <p>We provide 7 days free return policy</p>
      </div>

      <div className="plocies">
        <img src={assets.support_img} alt="" />
        <p>Best customer support</p>
        <p>we provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default OurPolicy
