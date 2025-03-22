import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/AuthSlice"; // Ensure this action is defined

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // Get user data from Redux store
  const dispatch = useDispatch();

  // State for form fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { name, email };
    dispatch(updateProfile(updatedUser)); // Dispatch the action to update profile
  };

  // Inline styles
  const styles = {
    profileContainer: {
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    profileForm: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    inputField: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    saveButton: {
      padding: "10px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
    },
    saveButtonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.profileContainer}>
      <h2>Profile Information</h2>
      <form onSubmit={handleSubmit} style={styles.profileForm}>
        <div style={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.inputField}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.inputField}
          />
        </div>
        <button
          type="submit"
          style={styles.saveButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.saveButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.saveButton.backgroundColor)}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
