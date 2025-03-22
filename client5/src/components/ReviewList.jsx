import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:2500/api/reviews/${productId}`);
        // Ensure the response data is an array
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      }
    };

    fetchReviews();
  }, [productId]);

  // Inline style objects
  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      fontSize: '16px',
    },
    reviewList: {
      marginTop: '20px',
    },
    reviewCard: {
      padding: '15px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    reviewerName: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    rating: {
      fontSize: '14px',
      color: '#f39c12',
    },
    comment: {
      fontSize: '14px',
      marginTop: '10px',
    },
    noReviews: {
      fontSize: '18px',
      color: '#555',
    },
  };

  return (
    <div style={styles.container}>
      <h3>Customer Reviews</h3>

      {/* Display error message if any */}
      {error && <p style={styles.error}>{error}</p>}

      {/* If no reviews are found */}
      {reviews.length === 0 ? (
        <p style={styles.noReviews}>No reviews yet.</p>
      ) : (
        <div style={styles.reviewList}>
          {reviews.map((review) => (
            <div key={review._id} style={styles.reviewCard}>
              <p style={styles.reviewerName}>{review.user.name}</p>
              <p style={styles.rating}>Rating: {review.rating} / 5</p>
              <p style={styles.comment}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;


