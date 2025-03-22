import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateCart, applyCoupon, initializeCart } from "../store/CartSlice";
import axios from "axios";

const Cart = () => {
  const { cartItems, discount, tax, shippingFee, finalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState({ country: "US" });
  const [availableCoupons, setAvailableCoupons] = useState([]); // State for available coupons

  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/coupons/available");
        setAvailableCoupons(response.data.coupons);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchCoupons();
  }, []);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCart && savedCart.length > 0) {
      dispatch(initializeCart(savedCart));
    }
  }, [dispatch]);

  // Save cart to localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Update item quantity
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCart({ productId, quantity }));
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post("http://localhost:2500/api/coupons/apply", {
        code: coupon,
        userLocation,
      });
      console.log('Coupon Applied Response:', response.data); 
      dispatch(
        applyCoupon({
          discount: response.data.discountedAmount,
          shippingFee: response.data.shippingFee,
          tax: response.data.tax,
          finalPrice: response.data.finalPrice,
        })
      );

      setError("");
    } catch (err) {
      setError("Invalid or expired coupon");
    }
  };

  // Handle coupon input change
  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
    setError("");
  };

  // Styles
  const styles = {
    cartContainer: {
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
    },
    cartItems: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    cartItem: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#fff",
    },
    cartItemImage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "5px",
    },
    cartItemDetails: {
      marginLeft: "20px",
      flex: 1,
    },
    quantityInput: {
      width: "50px",
      padding: "5px",
      marginLeft: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    removeButton: {
      padding: "5px 10px",
      backgroundColor: "red",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "15px",
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
    cartSummary: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #ddd",
    },
    checkoutButton: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      textDecoration: "none",
      borderRadius: "5px",
      display: "inline-block",
      marginTop: "10px",
    },
    discountText: {
      color: "green",
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      marginTop: "10px",
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
    <div style={styles.cartContainer}>
      <h4>Your Cart</h4>
      <div style={styles.cartItems}>
        {cartItems.length === 0 ? (
          <p>
            Your cart is empty. <Link to="/productlist">Start shopping</Link>
          </p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} style={styles.cartItem}>
              <img
                src={item.images?.[0] || "https://via.placeholder.com/100"}
                alt={item.name}
                style={styles.cartItemImage}
              />
              <div style={styles.cartItemDetails}>
                <h5>{item.name}</h5>
                <p>${item.price}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                  style={styles.quantityInput}
                />
              </div>
              <button onClick={() => handleRemoveItem(item._id)} style={styles.removeButton}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div style={styles.availableCoupons}>
  <h5>Available Coupons</h5>
  {availableCoupons.length > 0 ? (
    <ul style={styles.couponList}>
      {availableCoupons.map((coupon) => (
        <li key={coupon.code} style={styles.couponItem}>
          <strong>{coupon.code}</strong> - {coupon.discountPercentage}% off
          (Expires: {new Date(coupon.validUntil).toLocaleDateString()})
        </li>
      ))}
    </ul>
  ) : (
    <p>No available coupons at the moment.</p>
  )}
</div>


      {/* Apply Coupon Section */}
      <div style={styles.couponSection}>
        <h4>Apply Coupon</h4>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={handleCouponChange}
          style={styles.couponInput}
        />
        <button onClick={handleApplyCoupon} style={styles.applyButton}>
          Apply
        </button>
        {error && <p style={styles.errorText}>{error}</p>}
      </div>

      {/* Cart Summary */}
      <div style={styles.cartSummary}>
        {discount > 0 && <p style={styles.discountText}>Discount Applied: -${discount.toFixed(2)}</p>}
        {shippingFee > 0 && <p>Shipping Fee: ${shippingFee.toFixed(2)}</p>}
        {tax > 0 && <p>Tax: ${tax.toFixed(2)}</p>}
        <p>
          <strong>Final Price: ${finalPrice ? finalPrice.toFixed(2) : getTotalPrice().toFixed(2)}</strong>
        </p>
        <Link to="/checkout" style={styles.checkoutButton}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;




