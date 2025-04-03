import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:2500/api/admin/login', { 
        email, 
        password 
      });

      console.log('Login response:', response.data);

      if (response.data.message === 'Logged in successfully') {
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        switch(user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'vendor':
            navigate('/vendor-dashboard');
            break;
          case 'buyer':
            navigate('/buyer-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError('Invalid email or password');
        } else if (err.response.status === 404) {
          setError('User not found');
        } else if (err.response.status === 400) {
          setError('Incorrect password');
        } else {
          setError(err.response.data?.message || 'Login failed');
        }
      } else if (err.request) {
        // No response received
        setError('No response from server. Check your connection.');
      } else {
        // Request setup error
        setError('Error setting up login request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Create account</Link>
      </p>
    </div>
  );
};

export default Login;








