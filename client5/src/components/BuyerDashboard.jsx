

import React from 'react';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#fff3cd',
      borderRadius: '8px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    nav: {
      listStyleType: 'none',
      padding: '0',
      textAlign: 'center',
    },
    navItem: {
      margin: '10px 0',
    },
    link: {
      textDecoration: 'none',
      color: '#17a2b8',
      fontSize: '18px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Buyer Dashboard</h1>
      <nav>
        <ul style={styles.nav}>
          <li style={styles.navItem}>
            <Link to="/buyer/orders" style={styles.link}>My Orders</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/cart" style={styles.link}> Cart</Link>
          </li>
         
        </ul>
      </nav>
    </div>
  );
};

export default BuyerDashboard;









