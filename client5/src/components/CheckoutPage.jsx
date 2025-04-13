import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../store/CartSlice";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    cartItems,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
  } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate address fields
      const requiredFields = ["street", "city", "state", "zipCode"];
      for (let field of requiredFields) {
        if (!shippingAddress[field]) {
          setError(`Please fill in your ${field}`);
          setLoading(false);
          return;
        }
      }

      const orderData = {
        buyer: user._id,
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress,
      };

      console.log("Sending order data:", orderData);

      // Place order
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const createdOrder = orderRes.data.order;
      const orderId = createdOrder._id;

      // Load Stripe
      const stripe = await loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE);
      if (!stripe) {
        setError("Failed to load Stripe. Please try again.");
        setLoading(false);
        return;
      }

      // Create Stripe checkout session
      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}api/payments/create-checkout-session`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Stripe session response:", paymentRes.data);

      const sessionId = paymentRes?.data?.sessionId;
      if (!sessionId) {
        setError("Failed to create Stripe session. Please try again.");
        setLoading(false);
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error("Stripe redirect error:", result.error);
        setError(result.error.message);
        setLoading(false);
      } else {
        dispatch(clearCart()); // Clear cart only after successful Stripe session
      }
    } catch (err) {
      console.error("Order/Payment error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "An unexpected error occurred";
      setError(msg);
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "30px",
      color: "#333",
    },
    section: {
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "16px",
      backgroundColor: "white",
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: "1px solid #eee",
    },
    total: {
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
    },
    errorText: {
      color: "#ff4444",
      marginTop: "10px",
      textAlign: "center",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "20px",
    },
    loadingText: {
      textAlign: "center",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>

      {/* SHIPPING ADDRESS */}
      <div style={styles.section}>
        <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "#444" }}>Shipping Address</h3>
        {["street", "city", "state", "zipCode"].map((field) => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={shippingAddress[field]}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
        ))}
        <div style={{ marginBottom: "15px" }}>
          <label style={styles.label}>Country</label>
          <select
            name="country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div style={styles.section}>
        <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "#444" }}>Order Summary</h3>

        {cartItems.map((item) => (
          <div key={item._id} style={styles.summaryItem}>
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div style={styles.summaryItem}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div style={styles.summaryItem}>
            <span>Discount ({appliedCoupon}):</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div style={styles.summaryItem}>
          <span>Shipping:</span>
          <span>${shippingFee.toFixed(2)}</span>
        </div>
        <div style={styles.summaryItem}>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={styles.total}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}

      <button
        onClick={handlePlaceOrder}
        style={styles.button}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? "Placing Order..." : "Place Order & Pay with Stripe"}
      </button>

      {loading && <p style={styles.loadingText}>Redirecting to Stripe...</p>}
    </div>
  );
};

export default CheckoutPage;










