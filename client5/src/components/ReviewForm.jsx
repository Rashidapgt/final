import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated import

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Updated hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        productId,
        rating,
        comment,
      };

      await axios.post('http://localhost:2500/api/reviews', reviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      navigate(`/products/${productId}`); // Updated method to navigate
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  // Inline Styles
  const styles = {
    container: {
      padding: '20px',
      fontFamily: "'Arial', sans-serif",
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '0 auto',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    label: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#555',
    },
    select: {
      padding: '8px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      outline: 'none',
    },
    textarea: {
      padding: '8px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      outline: 'none',
      resize: 'vertical',
      minHeight: '100px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Write a Review</h3>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Rating: </label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={styles.select}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Comment: </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            style={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" style={styles.button}>Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;


