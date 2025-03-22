import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { applyCoupon } from "../store/CartSlice";

const CheckoutPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { discount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]); // State for available coupons
  const navigate = useNavigate();

  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/coupons");
        setAvailableCoupons(response.data.coupons);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchCoupons();
  }, []);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/cart");
        setCart(response.data);
        calculateTotal(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price
  const calculateTotal = (cartItems) => {
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
    setTotal(totalAmount);
  };



  // Place Order
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: user._id,
        items: cart,
        shippingAddress,
        paymentMethod,
        totalAmount: total - discount,
        discountApplied: discount,
      };

      const response = await axios.post("http://localhost:2500/api/orders", orderData);

      if (response.data.success) {
        await axios.post("http://localhost:2500/api/send-email", {
          userEmail: user.email,
          orderId: response.data.orderId,
          items: cart,
        });

        navigate("/order-history");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
    },
    header: {
      fontSize: "2rem",
      marginBottom: "20px",
      textAlign: "center",
    },
    input: {
      padding: "10px",
      margin: "10px 0",
      width: "100%",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    select: {
      padding: "10px",
      margin: "10px 0",
      width: "100%",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
    orderSummary: {
      marginTop: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      backgroundColor: "#f9f9f9",
    },
    orderItem: {
      marginBottom: "10px",
      padding: "10px",
      border: "1px solid #eee",
      borderRadius: "5px",
      backgroundColor: "#fafafa",
    },
    couponSection: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #ddd",
    },
    couponInput: {
      padding: "8px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      width: "200px",
    },
    applyButton: {
      padding: "8px 15px",
      backgroundColor: "green",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    availableCoupons: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #ddd",
    },
    couponList: {
      listStyleType: "none",
      padding: "0",
    },
    couponItem: {
      marginBottom: "10px",
      padding: "10px",
      border: "1px solid #eee",
      borderRadius: "5px",
      backgroundColor: "#fafafa",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Checkout</h2>

      

      {/* Shipping Address */}
      <div className="shipping-details">
        <h5>Shipping Address</h5>
        <input
          type="text"
          placeholder="Enter your shipping address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          style={styles.input}
          required
        />
      </div>

      {/* Payment Method */}
      <div className="payment-method">
        <h5>Payment Method</h5>
        <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} style={styles.select}>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      

      {/* Order Summary */}
      <div style={styles.orderSummary}>
        <h5>Order Summary</h5>
        <ul>
          {Array.isArray(cart) && cart.map((item) => (
            <li key={item._id} style={styles.orderItem}>
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
        {discount > 0 && <p style={{ color: "green" }}>Discount Applied: -${discount}</p>}
        <p><strong>Total: ${total - discount}</strong></p>
      </div>

      <button onClick={handlePlaceOrder} style={styles.button}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;



