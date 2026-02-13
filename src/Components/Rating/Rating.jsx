import React from 'react';
import './Rating.css';

const Rating = ({ value, total = 5, interactive = false, onRatingChange, size = 'medium' }) => {
  const handleRatingClick = (rating) => {
    if (interactive && onRatingChange) {
      onRatingChange(rating);
    }
  };

  return (
    <div className={`rating-container ${size}`}>
      {[...Array(total)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${ratingValue <= value ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
            onClick={() => handleRatingClick(ratingValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default Rating; 