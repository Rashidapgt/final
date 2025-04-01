import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch("http://localhost:2500/api/dashboard/buyer-dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          // If token is expired or invalid, remove it and redirect to login
          localStorage.removeItem('token');
          alert("Your session expired or you don't have buyer access");
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch buyer data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333"
    },
    section: {
      marginBottom: "30px",
      backgroundColor: "#f9f9f9",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#444"
    },
    list: {
      listStyleType: "none",
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: "12px",
      borderBottom: "1px solid #eee",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    status: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "bold"
    },
    statusPending: {
      backgroundColor: "#fff3cd",
      color: "#856404"
    },
    statusCompleted: {
      backgroundColor: "#d4edda",
      color: "#155724"
    },
    error: {
      color: "#dc3545",
      padding: "10px",
      backgroundColor: "#f8d7da",
      borderRadius: "4px",
      margin: "20px 0"
    },
    loading: {
      color: "#0d6efd",
      textAlign: "center",
      margin: "20px 0"
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { ...styles.status, ...styles.statusPending };
      case 'completed':
        return { ...styles.status, ...styles.statusCompleted };
      default:
        return styles.status;
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Buyer Dashboard</h3>
      
      {loading ? (
        <p style={styles.loading}>Loading dashboard data...</p>
      ) : error ? (
        <p style={styles.error}>Error: {error}</p>
      ) : (
        <>
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Recent Orders</h4>
            {data?.orders?.length > 0 ? (
              <ul style={styles.list}>
                {data.orders.map((order) => (
                  <li key={order._id} style={styles.listItem}>
                    <div>
                      <strong>Order #{order.orderNumber || order._id.slice(-6)}</strong>
                      <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <strong>${order.totalAmount?.toFixed(2)}</strong>
                      <span style={getStatusStyle(order.status)}>
                        {order.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerDashboard;


