import React from 'react'
import './NewsLetterBox.css'
const NewsLetterBox = () => {
  return (
    <div className='NewsLetterBox'>

      <div className='NewsLetterBox__title'>
        <h1>Subscribe now & get 20% off</h1>
        <p>Subscribe to our newsletter and get the latest updates and offers.</p>
      </div>

        <div className='NewsLetterBox__input'>
            <input type="email" placeholder='Enter your email' />
            <button>Subscribe</button>
        </div>

    </div>
  )
}

export default NewsLetterBox
