import React, { useState } from 'react';
import { updateProfile } from '../store/AuthSlice';

const formStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  alert: {
    padding: '10px 15px',
    marginBottom: '20px',
    borderRadius: '4px'
  },
  alertDanger: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  alertSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '100px',
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#0056b3'
    },
    ':disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed'
    }
  },
  sectionTitle: {
    margin: '20px 0 15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee'
  }
};

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    ...(user.role === 'vendor' && {
      storeName: user.store.name || '',
      storeDescription: user.store.description || '',
      contactEmail: user.store.contactEmail || '',
      contactPhone: user.store.contactPhone || ''
    })
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      const updatedUser = await updateProfile(formData);
      onUpdate(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      setErrors({ form: error.response?.data?.message || 'Update failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      {errors.form && (
        <div style={{ ...formStyles.alert, ...formStyles.alertDanger }}>
          {errors.form}
        </div>
      )}
      {success && (
        <div style={{ ...formStyles.alert, ...formStyles.alertSuccess }}>
          Profile updated successfully!
        </div>
      )}

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={formStyles.input}
        />
      </div>

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={formStyles.input}
        />
      </div>

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={formStyles.input}
        />
      </div>

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={formStyles.input}
        />
      </div>

      {user.role === 'vendor' && (
        <>
          <h3 style={formStyles.sectionTitle}>Store Information</h3>
          
          <div style={formStyles.formGroup}>
            <label style={formStyles.label}>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
              style={formStyles.input}
            />
          </div>

          <div style={formStyles.formGroup}>
            <label style={formStyles.label}>Store Description</label>
            <textarea
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              style={formStyles.textarea}
            />
          </div>

          <div style={formStyles.formGroup}>
            <label style={formStyles.label}>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              style={formStyles.input}
            />
          </div>

          <div style={formStyles.formGroup}>
            <label style={formStyles.label}>Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              style={formStyles.input}
            />
          </div>
        </>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{
          ...formStyles.button,
          ...(isSubmitting && formStyles.button[':disabled'])
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProfileForm;