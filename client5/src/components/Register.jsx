import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/AuthSlice";
import { useNavigate, Link } from "react-router-dom";

const styles = {
  authContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  authCard: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
  },
  authInput: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  authButton: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  authButtonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },
  authError: {
    color: "red",
    margin: "10px 0",
  },
  authSwitch: {
    marginTop: "10px",
  },
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [storeName, setStoreName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      alert("Please fill out all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (role === "vendor" && !storeName) {
      alert("Store name is required for vendors.");
      return;
    }
    const userData = {
      name,
      email,
      password,
      role,
      storeName: role === "vendor" ? storeName : undefined,
    };
    const result = await dispatch(registerUser(userData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h2>Register</h2>
        {error && <p style={styles.authError}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.authInput}
            disabled={isLoading}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.authInput}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.authInput}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.authInput}
            disabled={isLoading}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.authInput}
            disabled={isLoading}
            required
          >
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
          {role === "vendor" && (
            <input
              type="text"
              placeholder="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={styles.authInput}
              disabled={isLoading}
              required
            />
          )}
          <button
            type="submit"
            style={{ ...styles.authButton, ...(isLoading ? styles.authButtonDisabled : {}) }}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={styles.authSwitch}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;



