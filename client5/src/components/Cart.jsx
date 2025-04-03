import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  removeFromCart, 
  updateCart, 
  applyCoupon, 
  removeCoupon,
  initializeCart 
} from "../store/CartSlice";
import axios from "axios";

const Cart = () => {
  const { 
    cartItems, 
    discount, 
    shippingFee, 
    tax, 
    subtotal,
    total,
    appliedCoupon 
  } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);

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

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Update item quantity
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCart({ productId, quantity }));
  };
  const handleApplyCoupon = async () => {
    try {
        setError("");

        if (!cartItems || cartItems.length === 0) {
            setError("Cart is empty. Add items before applying a coupon.");
            return;
        }

        if (!coupon.trim()) {
            setError("Please enter a coupon code");
            return;
        }

        let userLocation = JSON.parse(localStorage.getItem("userLocation"));
    
        if (!userLocation) {
            userLocation = { country: "USA", state: "New York" };  // Set a default or fetch from user profile
            localStorage.setItem("userLocation", JSON.stringify(userLocation)); // Save to localStorage
        }

        if (!userLocation || !userLocation.country) {
            setError("User location is required to apply this coupon.");
            return;
        }

        const response = await axios.post(
            "http://localhost:2500/api/coupons/apply",
            { 
                code: coupon, 
                cartItems,
                userLocation  // ✅ Ensure userLocation is sent in the request
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (response.data.discountedAmount !== undefined) {
            dispatch(
                applyCoupon({
                    discount: response.data.discountedAmount,
                    couponCode: coupon,
                })
            );
            setError("");
        } else {
            setError(response.data.message || "Could not apply coupon");
        }
    } catch (err) {
        console.error("Coupon error:", err.response?.data);
        setError(err.response?.data?.message || "Invalid or expired coupon");
    }
};

  // Remove coupon
  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCoupon("");
  };

  // Styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Arial', sans-serif"
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333"
    },
    cartItems: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginBottom: "30px"
    },
    cartItem: {
      display: "flex",
      alignItems: "center",
      padding: "15px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    itemImage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "4px"
    },
    itemDetails: {
      flex: 1,
      marginLeft: "20px"
    },
    itemName: {
      fontSize: "16px",
      marginBottom: "5px"
    },
    itemPrice: {
      color: "#666",
      marginBottom: "10px"
    },
    quantityInput: {
      width: "60px",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ddd"
    },
    removeButton: {
      padding: "8px 15px",
      backgroundColor: "#ff4444",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginLeft: "15px"
    },
    couponSection: {
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    },
    couponHeader: {
      fontSize: "18px",
      marginBottom: "15px"
    },
    couponInputGroup: {
      display: "flex",
      gap: "10px",
      marginBottom: "10px"
    },
    couponInput: {
      flex: 1,
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd"
    },
    applyButton: {
      padding: "10px 20px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    removeCouponButton: {
      padding: "10px 20px",
      backgroundColor: "#ff4444",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    errorText: {
      color: "#ff4444",
      marginTop: "10px"
    },
    successText: {
      color: "#4CAF50",
      marginTop: "10px"
    },
    summarySection: {
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: "1px solid #eee"
    },
    totalRow: {
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "15px"
    },
    checkoutButton: {
      display: "block",
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      textAlign: "center",
      borderRadius: "4px",
      textDecoration: "none",
      marginTop: "20px",
      fontSize: "16px"
    },
    emptyCart: {
      textAlign: "center",
      padding: "40px 0"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/productlist" style={styles.checkoutButton}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item._id} style={styles.cartItem}>
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/100"}
                  alt={item.name}
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  <div>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                      style={styles.quantityInput}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item._id)} 
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div style={styles.couponSection}>
            <h4 style={styles.couponHeader}>Apply Coupon Code</h4>
            {discount > 0 ? (
              <div>
                <p style={styles.successText}>
                  Coupon "{appliedCoupon}" applied (-${discount.toFixed(2)})
                </p>
                <button 
                  onClick={handleRemoveCoupon}
                  style={styles.removeCouponButton}
                >
                  Remove Coupon
                </button>
              </div>
            ) : (
              <>
                {/* Display Available Coupons Dropdown */}
                <div style={styles.couponInputGroup}>
                  <select
                    onChange={(e) => setCoupon(e.target.value)}
                    value={coupon}
                    style={styles.couponInput}
                  >
                    <option value="">Select a coupon</option>
                    {availableCoupons.map((couponItem) => (
                      <option key={couponItem.code} value={couponItem.code}>
                        {couponItem.code} 
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={handleApplyCoupon} 
                    style={styles.applyButton}
                  >
                    Apply
                  </button>
                </div>
                
                {error && <p style={styles.errorText}>{error}</p>}
              </>
            )}
          </div>

          {/* Order Summary */}
          <div style={styles.summarySection}>
            <h4>Order Summary</h4>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={styles.summaryRow}>
                <span>Discount:</span>
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
            <div style={{...styles.summaryRow, ...styles.totalRow}}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" style={styles.checkoutButton}>
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;


