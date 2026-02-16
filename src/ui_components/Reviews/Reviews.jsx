import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Rating from '../Rating/Rating';
import './Reviews.css';
import { toast } from 'react-toastify';

const Reviews = ({ productId }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch reviews for the product
  React.useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/reviews/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a review');
      return;
    }

    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/reviews/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Review submitted successfully');
        setNewReview({ rating: 0, comment: '' });
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-container">
      {/* Review Form */}
      <div className="review-form">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="rating-field">
            <label>Your Rating</label>
            <Rating
              value={newReview.rating}
              interactive={true}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              size="large"
            />
          </div>
          <div className="comment-field">
            <label>Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this product..."
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <Rating value={review.rating} size="small" />
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="reviewer-name">{review.userId?.name || 'Anonymous'}</p>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews; 