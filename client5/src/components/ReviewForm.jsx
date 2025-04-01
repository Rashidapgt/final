import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You need to login to submit a review');
        setIsSubmitting(false);
        navigate('/login');
        return;
      }
  
      const reviewData = {
        product: productId,  // Changed from productId to product
        rating,
        comment,
      };
  
      const response = await axios.post('http://localhost:2500/api/reviews', reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setError('Review submitted successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/products/${productId}`);
      }, 1500);
    } catch (error) {
      console.error('Review submission error:', error);
      
      let errorMessage = 'Failed to submit review';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline Styles
  const styles = {
    container: {
      padding: '25px',
      fontFamily: "'Arial', sans-serif",
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '20px auto',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    label: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#555',
      marginBottom: '5px',
      display: 'block',
    },
    select: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      outline: 'none',
      width: '100%',
    },
    textarea: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      width: '100%',
      fontFamily: 'inherit',
    },
    button: {
      padding: '12px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#0056b3',
      },
      ':disabled': {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
      },
    },
    error: {
      color: '#d32f2f',
      fontSize: '14px',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#fde0e0',
      borderRadius: '4px',
      margin: '10px 0',
    },
    success: {
      color: '#388e3c',
      fontSize: '14px',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#e8f5e9',
      borderRadius: '4px',
      margin: '10px 0',
    },
    loginPrompt: {
      textAlign: 'center',
      marginTop: '15px',
    },
    loginLink: {
      color: '#007bff',
      textDecoration: 'none',
      fontWeight: 'bold',
      ':hover': {
        textDecoration: 'underline',
      },
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Write a Review</h3>
      
      {/* Display error or success message */}
      {error && (
        <div style={error.startsWith('Review submitted') ? styles.success : styles.error}>
          {error}
          {error === 'You need to login to submit a review' && (
            <div style={styles.loginPrompt}>
              <a href="/login" style={styles.loginLink}>Click here to login</a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label htmlFor="rating" style={styles.label}>Rating:</label>
          <select 
            id="rating"
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))} 
            style={styles.select}
            required
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="comment" style={styles.label}>Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            style={styles.textarea}
            placeholder="Share your experience with this product..."
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

