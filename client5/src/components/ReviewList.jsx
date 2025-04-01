import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:2500/api/reviews?product=${productId}`
        );
        const reviewsData = response.data.reviews || response.data;
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.response?.data?.message || 'Failed to load reviews.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `http://localhost:2500/api/reviews`,
        { productId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 401) {
        setError("You must be logged in to submit a review.");
      } else {
        setError(error.response?.data?.message || "Failed to submit review.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: { padding: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
    title: { fontSize: '24px', marginBottom: '20px', color: '#333' },
    error: { color: '#d32f2f', fontSize: '16px', padding: '10px', backgroundColor: '#fde0e0', borderRadius: '4px', margin: '10px 0' },
    success: { color: 'green', fontSize: '16px', padding: '10px', backgroundColor: '#e0f7e0', borderRadius: '4px', margin: '10px 0' },
    loading: { color: '#666', fontSize: '16px' },
    reviewList: { marginTop: '20px' },
    reviewCard: { padding: '20px', margin: '15px 0', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', backgroundColor: '#fff', textAlign: 'left' },
    reviewerName: { fontWeight: 'bold', fontSize: '16px', color: '#333', marginBottom: '5px' },
    rating: { fontSize: '14px', color: '#ff9800', marginBottom: '10px' },
    comment: { fontSize: '14px', marginTop: '10px', color: '#555', lineHeight: '1.5' },
    noReviews: { fontSize: '16px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' },
    star: { color: '#ffc107', marginRight: '2px' },
    form: { marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'left' },
    textarea: { width: '100%', minHeight: '80px', padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
    submitBtn: { padding: '10px 15px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
    disabledBtn: { backgroundColor: '#ccc', cursor: 'not-allowed' }
  };

  const renderStars = (rating) => (
    <span>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={styles.star}>{i < rating ? '★' : '☆'}</span>
      ))}
    </span>
  );

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Customer Reviews</h3>
      {isLoading && <p style={styles.loading}>Loading reviews...</p>}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
      {!isLoading && !error && reviews.length === 0 ? (
        <div style={styles.noReviews}>No reviews yet. Be the first to review this product!</div>
      ) : (
        <div style={styles.reviewList}>
          {reviews.map((review) => (
            <div key={review._id} style={styles.reviewCard}>
              <p style={styles.reviewerName}>{review.user?.name || 'Anonymous'}</p>
              <p style={styles.rating}>{renderStars(review.rating)} ({review.rating}/5)</p>
              <p style={styles.comment}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      <form style={styles.form} onSubmit={handleSubmit}>
        <textarea style={styles.textarea} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review..." required />
        <button type="submit" style={isSubmitting ? { ...styles.submitBtn, ...styles.disabledBtn } : styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewList;
