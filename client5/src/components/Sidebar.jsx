import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/AuthSlice";
import { FaHome, FaProductHunt, FaListAlt, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token"); // Clear token on logout
  };

  // Define your styles object
  const inStyle = {
    sidebar: {
      width: "250px",
      height: "100vh",
      backgroundColor: "#2c3e50",
      color: "#ecf0f1",
      padding: "20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
    },
    list: {
      listStyleType: "none",
      padding: "0",
      margin: "0",
    },
    listItem: {
      marginBottom: "15px",
    },
    link: {
      color: "#ecf0f1",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
      padding: "10px",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    },
    activeLink: {
      backgroundColor: "#34495e", // Active state style
    },
    icon: {
      marginRight: "10px", // Ensuring space between icon and text
    },
    logoutButton: {
      backgroundColor: "#e74c3c",
      color: "#ecf0f1",
      border: "none",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      transition: "background-color 0.3s ease",
    },
    logoutButtonHover: {
      backgroundColor: "#c0392b", // Adding hover effect style
    },
  };

  return (
    <div style={inStyle.sidebar}>
      <h2 style={inStyle.heading}>Dashboard</h2>
      <ul style={inStyle.list}>
        <li style={inStyle.listItem}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...inStyle.link,
              ...(isActive ? inStyle.activeLink : {}),
            })}
          >
            <FaHome style={inStyle.icon} /> Home
          </NavLink>
        </li>
        <li style={inStyle.listItem}>
          <NavLink
            to="/dashboard/products"
            style={({ isActive }) => ({
              ...inStyle.link,
              ...(isActive ? inStyle.activeLink : {}),
            })}
          >
            <FaProductHunt style={inStyle.icon} /> Manage Products
          </NavLink>
        </li>
        <li style={inStyle.listItem}>
          <NavLink
            to="/dashboard/orders"
            style={({ isActive }) => ({
              ...inStyle.link,
              ...(isActive ? inStyle.activeLink : {}),
            })}
          >
            <FaListAlt style={inStyle.icon} /> View Orders
          </NavLink>
        </li>
        <li style={inStyle.listItem}>
          <NavLink
            to="/dashboard/vendor-dashboard"
            style={({ isActive }) => ({
              ...inStyle.link,
              ...(isActive ? inStyle.activeLink : {}),
            })}
          >
            <FaUsers style={inStyle.icon} /> Vendor Dashboard
          </NavLink>
        </li>
        <li style={inStyle.listItem}>
          <NavLink
            to="/dashboard/buyer-dashboard"
            style={({ isActive }) => ({
              ...inStyle.link,
              ...(isActive ? inStyle.activeLink : {}),
            })}
          >
            <FaUsers style={inStyle.icon} /> Buyer Dashboard
          </NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <button 
        style={inStyle.logoutButton} 
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;






