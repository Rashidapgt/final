import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:2500/api/orders/user/${user._id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    if (user) {
      fetchOrderHistory();
    }
  }, [user]);

  const styles = {
    orderHistoryContainer: {
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    orderCard: {
      backgroundColor: '#fff',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    trackOrderButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    trackOrderButtonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div className={styles.orderHistoryContainer}>
      <h4>Order History</h4>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className={styles.orderCard}>
              <h3>Order #{order._id}</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${order.totalAmount}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <button className={styles.trackOrderButton}>Track Order</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;

