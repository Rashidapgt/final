import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { logoutUser } from "../store/AuthSlice";
import { Link } from "react-router-dom";
import NotificationSender from "./NotificationSender";

const styles = {
  dashboardContainer: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "20px",
  },
  content: {
    flex: 1,
    padding: "20px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginLeft: "20px",
  },
  dashboardLinks: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  dashboardButton: {
    padding: "10px",
    background: "#007bff",
    color: "white",
    textDecoration: "none",
    textAlign: "center",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  dashboardButtonHover: {
    background: "#0056b3",
  },
  logoutButton: {
    marginTop: "20px",
    padding: "10px",
    background: "#dc3545",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  logoutButtonHover: {
    background: "#a71d2a",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    // Simulating loading process
    setLoading(false); // Remove this once you add real API data fetching
    // Here you can use API call to fetch user-specific data if needed
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <Sidebar />

      <div style={styles.content}>
        <h5>Welcome, {user?.name}</h5>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <NotificationSender
        type="adminSignup" 
        vendor={{ _id: "123", name: "New Vendor" }} 
        />

        <div style={styles.dashboardLinks}>
          {user?.role === "vendor" && (
            <>
              <Link to="/products" style={styles.dashboardButton}>
                Manage Products
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link to="/vendor-dashboard" style={styles.dashboardButton}>
                Vendor Dashboard
              </Link>
              <Link to="/buyer-dashboard" style={styles.dashboardButton}>
                Buyer Dashboard
              </Link>
            </>
          )}
          <Link to="/order-history" style={styles.dashboardButton}>
            View Order History
          </Link>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseOver={(e) => (e.target.style.background = styles.logoutButtonHover.background)}
            onMouseOut={(e) => (e.target.style.background = styles.logoutButton.background)}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



