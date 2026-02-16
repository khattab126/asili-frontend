import React from 'react'
import './Hero.css'
import hero_image from '../../assets/hero.png';
const Hero = () => {
  return (
    <div className="hero-container">
        <div className='hero'>
          <div className="left-hero">
            <p>OUR BESTSELLERS</p>
            <p>Latest Arrivals</p>
            <p>SHOP NOW</p>
          </div>
        <div className="right-hero">
          <img src={hero_image} alt="Hero" />
        </div>
      </div>
    </div>
  )
}

export default Hero
