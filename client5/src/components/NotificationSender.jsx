import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const NotificationSender = ({ type, order = null, vendor = null, onNotificationSent }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [targetInfo, setTargetInfo] = useState('');

  useEffect(() => {
    // Set target information based on notification type
    if (type === 'customerStatus' && order) {
      setTargetInfo(`Order #${order.orderNumber || order._id}`);
    } else if (type === 'vendorOrder' && order) {
      setTargetInfo(`Order #${order.orderNumber || order._id}`);
    } else if (type === 'adminSignup' && vendor) {
      setTargetInfo(`Vendor: ${vendor.businessName || vendor.name}`);
    }
  }, [type, order, vendor]);

  const API_ENDPOINTS = {
    vendorOrder: 'http://localhost:2500/api/notifications/vendor/order',
    customerStatus: 'http://localhost:2500/api/notifications/customer/order-status',
    adminSignup: 'http://localhost:2500/api/notifications/admin/vendor-signup'
  };

  const sendNotification = async () => {
    setLoading(true);
    setStatus('');

    try {
      let payload = {};
      const endpoint = API_ENDPOINTS[type];

      switch (type) {
        case 'customerStatus':
          if (!order?._id || !selectedStatus) throw new Error('Missing order ID or status');
          payload = { orderId: order._id, status: selectedStatus };
          break;

        case 'vendorOrder':
          if (!order?._id) throw new Error('Missing order ID');
          payload = { orderId: order._id, vendorId: order.vendorId || order.vendor?._id };
          break;

        case 'adminSignup':
          if (!vendor?._id) throw new Error('Missing vendor ID');
          payload = { vendorId: vendor._id };
          break;

        default:
          throw new Error('Invalid notification type');
      }

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setStatus('success');
      setSelectedStatus('');
      if (onNotificationSent) onNotificationSent(response.data);
    } catch (err) {
      console.error('Notification error:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Sending...';
    switch (type) {
      case 'customerStatus': return 'Update Status';
      case 'vendorOrder': return 'Notify Vendor';
      case 'adminSignup': return 'Alert Admin';
      default: return 'Send Notification';
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>
        {type === 'vendorOrder' && 'Notify Vendor About Order'}
        {type === 'customerStatus' && 'Update Customer Order Status'}
        {type === 'adminSignup' && 'Alert Admin About New Vendor'}
      </h3>

      {targetInfo && <p style={styles.infoText}>Target: {targetInfo}</p>}

      {type === 'customerStatus' && (
        <>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="">Select new status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {order?.status && <p style={styles.infoText}>Current status: <strong>{order.status}</strong></p>}
        </>
      )}

      <button
        onClick={sendNotification}
        disabled={loading || (type === 'customerStatus' && !selectedStatus)}
        style={{ ...styles.button, ...styles.buttonStates[type] }}
      >
        {getButtonText()}
      </button>

      {status && (
        <p style={{ ...styles.statusMessage, ...styles.statusStates[status] }}>
          {status === 'success' ? '✓ Notification sent successfully!' : '✗ Failed to send notification'}
        </p>
      )}
    </div>
  );
};

// Prop Type Validations
NotificationSender.propTypes = {
  type: PropTypes.oneOf(['vendorOrder', 'customerStatus', 'adminSignup']).isRequired,
  order: PropTypes.shape({
    _id: PropTypes.string,
    orderNumber: PropTypes.string,
    status: PropTypes.string,
    vendorId: PropTypes.string,
    vendor: PropTypes.shape({
      _id: PropTypes.string
    })
  }),
  vendor: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    businessName: PropTypes.string
  }),
  onNotificationSent: PropTypes.func
};

// ✅ Reusable Styles Object
const styles = {
  container: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '5px',
    margin: '10px 0',
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 0,
    color: '#333',
    fontSize: '18px'
  },
  select: {
    padding: '8px',
    marginRight: '10px',
    minWidth: '150px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '8px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonStates: {
    vendorOrder: { backgroundColor: '#3498db' },
    customerStatus: { backgroundColor: '#3498db' },
    adminSignup: { backgroundColor: '#e74c3c' }
  },
  statusMessage: {
    margin: '10px 0 0',
    padding: '5px',
    borderRadius: '3px'
  },
  statusStates: {
    success: { color: '#27ae60', backgroundColor: '#e8f5e9' },
    error: { color: '#e74c3c', backgroundColor: '#ffebee' }
  },
  infoText: {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0'
  }
};

export default NotificationSender;
