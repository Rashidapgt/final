import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../components/Sidebar";
import { logoutUser } from "../store/AuthSlice"; // Import logoutUser action
import { Link } from "react-router-dom";

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
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div style={styles.dashboardContainer}>
      <Sidebar />

      <div style={styles.content}>
  <h5>Welcome, {user?.name }</h5>
  <p>Email: {user?.email }</p>
  <p>Role: {user?.role }</p>


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
              <Link to="/approve-vendors" style={styles.dashboardButton}>
                Approve Vendors
              </Link>
              <Link to="/manage-users" style={styles.dashboardButton}>
                Manage Users
              </Link>
            </>
          )}
          <Link to="/order-history" style={styles.dashboardButton}>
            View Order History
          </Link>

          {/* Logout Button */}
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


