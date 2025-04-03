import React, { useEffect, useState } from "react";
import axios from "axios";

const Analytics = () => {
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

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      marginTop: "20px",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    item: {
      fontSize: "1.2rem",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Analytics</h2>
      {analytics ? (
        <>
          <p style={styles.item}>Total Revenue: ${analytics.totalRevenue}</p>
          <p style={styles.item}>Total Orders: {analytics.totalOrders}</p>
          <p style={styles.item}>Low Stock Products: {analytics.lowStock.length}</p>
        </>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
};

export default Analytics;
