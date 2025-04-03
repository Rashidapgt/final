import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const VendorDashboard = () => {
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
    nav: {
      listStyleType: "none",
      padding: "0",
      textAlign: "center",
    },
    navItem: {
      margin: "10px 0",
    },
    link: {
      textDecoration: "none",
      color: "#28a745",
      fontSize: "18px",
    },
    analyticsContainer: {
      backgroundColor: "#fff",
      padding: "20px",
      marginTop: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    analyticsHeading: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "20px",
    },
    analyticsItem: {
      fontSize: "1.2rem",
      color: "#555",
      marginBottom: "10px",
    },
  };

  const [analytics, setAnalytics] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/dashboard/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [token]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vendor Dashboard</h1>

      <nav>
        <ul style={styles.nav}>
          <li style={styles.navItem}>
            <Link to="/manageproducts" style={styles.link}>Manage Products</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/vendor/orders" style={styles.link}>View Orders</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/analytics" style={styles.link}>Analytics</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/withdrawals" style={styles.link}>Withdraw Earnings</Link>
          </li>
        </ul>
      </nav>
</div>
  );
};

export default VendorDashboard;











