import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../store/CartSlice";

const CheckoutPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { 
    cartItems, 
    subtotal, 
    discount, 
    shippingFee, 
    tax, 
    total,
    appliedCoupon 
  } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });
  
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set default address if user has one
  useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!shippingAddress.street || !shippingAddress.city || 
          !shippingAddress.state || !shippingAddress.zipCode) {
        setError("Please fill in all shipping address fields");
        setLoading(false);
        return;
      }

      const orderData = {
        userId: user._id,
        items: cartItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        couponCode: appliedCoupon
      };

      const response = await axios.post(
        "http://localhost:2500/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data.success) {
        // Clear cart after successful order
        dispatch(clearCart());
        
        // Redirect to order confirmation
        navigate(`/order-confirmation/${response.data.order._id}`);
      } else {
        setError(response.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(err.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Arial', sans-serif"
    },
    header: {
      fontSize: "24px",
      marginBottom: "30px",
      color: "#333"
    },
    section: {
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    sectionHeader: {
      fontSize: "18px",
      marginBottom: "20px",
      color: "#444"
    },
    formGroup: {
      marginBottom: "15px"
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "16px"
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "16px",
      backgroundColor: "white"
    },
    paymentMethod: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px"
    },
    radio: {
      marginRight: "10px"
    },
    orderItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: "1px solid #eee"
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px"
    },
    totalRow: {
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #ddd"
    },
    placeOrderBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "20px"
    },
    errorText: {
      color: "#ff4444",
      marginTop: "10px",
      textAlign: "center"
    },
    loadingText: {
      textAlign: "center",
      marginTop: "10px"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Checkout</h2>
      
      {/* Shipping Address Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Shipping Address</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Street Address</label>
          <input
            type="text"
            name="street"
            value={shippingAddress.street}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>City</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>State/Province</label>
          <input
            type="text"
            name="state"
            value={shippingAddress.state}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>ZIP/Postal Code</label>
          <input
            type="text"
            name="zipCode"
            value={shippingAddress.zipCode}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
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
            {/* Add more countries as needed */}
          </select>
        </div>
      </div>

      {/* Payment Method Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Payment Method</h3>
        <div style={styles.paymentMethod}>
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            value="creditCard"
            checked={paymentMethod === "creditCard"}
            onChange={() => setPaymentMethod("creditCard")}
            style={styles.radio}
          />
          <label htmlFor="creditCard">Credit Card</label>
        </div>
        <div style={styles.paymentMethod}>
          <input
            type="radio"
            id="paypal"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
            style={styles.radio}
          />
          <label htmlFor="paypal">PayPal</label>
        </div>
        <div style={styles.paymentMethod}>
          <input
            type="radio"
            id="bankTransfer"
            name="paymentMethod"
            value="bankTransfer"
            checked={paymentMethod === "bankTransfer"}
            onChange={() => setPaymentMethod("bankTransfer")}
            style={styles.radio}
          />
          <label htmlFor="bankTransfer">Bank Transfer</label>
        </div>
      </div>

      {/* Order Summary Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item._id} style={styles.orderItem}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div style={styles.summaryRow}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div style={styles.summaryRow}>
            <span>Discount ({appliedCoupon}):</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div style={styles.summaryRow}>
          <span>Shipping:</span>
          <span>${shippingFee.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={styles.totalRow}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <p style={styles.errorText}>{error}</p>}

      {/* Place Order Button */}
      <button 
        onClick={handlePlaceOrder} 
        style={styles.placeOrderBtn}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
      {loading && <p style={styles.loadingText}>Please wait...</p>}
    </div>
  );
};

export default CheckoutPage;



