import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
    },
    sidebar: {
      width: '250px', // Adjust the width of the sidebar
      backgroundColor: '#343a40',
      padding: '20px',
      color: '#fff',
      height: '100vh',
      position: 'fixed',
      top: '0',
      left: '0',
    },
    content: {
      marginLeft: '250px', // Leave space for the sidebar
      padding: '20px',
      width: 'calc(100% - 250px)', // Make sure content takes up the remaining space
      backgroundColor: '#f4f4f4',
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
      color: '#007bff',
      fontSize: '18px',
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar style={styles.sidebar} />
      <div style={styles.content}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <nav>
          <ul style={styles.nav}>
            <li style={styles.navItem}>
              <Link to="/admin/pending-vendors" style={styles.link}>Manage Vendors</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/admin/orders" style={styles.link}>View Orders</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/admin/manageproducts" style={styles.link}>Manage Products</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;









