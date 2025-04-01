import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/AuthSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user, isAuthenticated } = useSelector((state) => state.auth);

  console.log("Current auth state:", { isLoading, error, user, isAuthenticated });

  // Handle redirection after successful login
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      const role = user?.role?.toLowerCase();
      const dashboardRoute = {
        admin: "/admin-dashboard",
        vendor: "/vendor-dashboard",
        buyer: "/buyer-dashboard",
      };

      const route = dashboardRoute[role] || "/";
      navigate(route);
    }
  }, [isAuthenticated, user, navigate]); // Dependency on isAuthenticated and user

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });

    try {
      const result = await dispatch(loginUser({ email, password }));
      console.log("Login result:", result);

      if (loginUser.fulfilled.match(result)) {
        console.log("Login successful - payload:", result.payload);
      } else if (loginUser.rejected.match(result)) {
        console.log("Login failed:", result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Styles (simplified for clarity)
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
    },
    card: {
      background: "white",
      padding: "2rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      margin: "0.5rem 0",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "0.375rem",
      marginTop: "1rem",
      cursor: "pointer",
    },
    error: {
      color: "#e53e3e",
      margin: "0.5rem 0",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome Back</h2>
        {error && (
          <p style={styles.error}>
            {error.message || "Login failed. Please try again."}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;






