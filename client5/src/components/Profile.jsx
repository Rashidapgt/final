import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  updateProfile } from '../store/AuthSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Get profile data from Redux store
  const { user, loading, error } = useSelector((state) => state.auth);

  // Complete style object
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '28px',
      margin: '0',
      color: '#333'
    },
    roleBadge: {
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    vendorBadge: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    customerBadge: {
      backgroundColor: '#cce5ff',
      color: '#004085',
      border: '1px solid #b8daff'
    },
    content: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    profileSection: {
      display: 'flex',
      gap: '30px',
      flexWrap: 'wrap'
    },
    avatarContainer: {
      flex: '0 0 200px',
      textAlign: 'center'
    },
    avatar: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #eee',
      marginBottom: '15px'
    },
    infoContainer: {
      flex: '1',
      minWidth: '300px'
    },
    infoItem: {
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    infoLabel: {
      width: '120px',
      fontWeight: 'bold',
      color: '#555',
      marginRight: '10px'
    },
    infoValue: {
      flex: '1',
      padding: '8px 0'
    },
    inputField: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      margin: '5px 0'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    primaryButton: {
      backgroundColor: '#3498db',
      color: 'white',
      '&:hover': {
        backgroundColor: '#2980b9'
      }
    },
    secondaryButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      '&:hover': {
        backgroundColor: '#7f8c8d'
      }
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: '#666'
    },
    error: {
      color: '#e74c3c',
      backgroundColor: '#fadbd8',
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    }
  };



  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err);
      if (err?.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.error}>
          {error.includes('401') ? 'Session expired. Please login again.' : error}
        </div>
        <button 
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        {user?.role && (
          <div style={{
            ...styles.roleBadge,
            ...(user.role === 'vendor' ? styles.vendorBadge : styles.customerBadge)
          }}>
            {user.role.toUpperCase()}
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.profileSection}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || ''}</p>
          </div>

          <div style={styles.infoContainer}>
            {!editMode ? (
              <>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Name:</div>
                  <div style={styles.infoValue}>{user?.name || 'Not provided'}</div>
                </div>
                {/* ... other profile fields ... */}
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* ... edit form fields ... */}
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;