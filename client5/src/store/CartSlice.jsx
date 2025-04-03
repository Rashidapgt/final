import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  return localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];
};

const initialState = {
  cartItems: loadCartFromStorage(),
  discount: localStorage.getItem("discount") 
    ? JSON.parse(localStorage.getItem("discount")) 
    : 0,
  appliedCoupon: localStorage.getItem("appliedCoupon") 
    ? JSON.parse(localStorage.getItem("appliedCoupon")) 
    : null,
  shippingFee: 0,
  tax: 0,
  subtotal: 0,
  total: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Add product to cart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cartItems.find(item => item._id === product._id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ Remove product from cart
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload);

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ Update quantity of a product
    updateCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.cartItems.find(item => item._id === productId);

      if (product) {
        product.quantity = quantity;
      }

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ Restore cart on page reload
    initializeCart: (state, action) => {
      state.cartItems = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },

    // ✅ Apply discount from coupon
    applyCoupon: (state, action) => {
      const { discount, couponCode } = action.payload;
      state.discount = discount;
      state.appliedCoupon = couponCode;

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem("discount", JSON.stringify(state.discount));
      localStorage.setItem("appliedCoupon", JSON.stringify(state.appliedCoupon));
    },

    // ✅ Remove applied coupon
    removeCoupon: (state) => {
      state.discount = 0;
      state.appliedCoupon = null;

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.removeItem("discount");
      localStorage.removeItem("appliedCoupon");
    },

    // ✅ Calculate all totals
    calculateTotals: (state) => {
      // Calculate subtotal
      state.subtotal = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );

      // Shipping Fee (Example: Free shipping for orders above $100)
      state.shippingFee = state.subtotal > 100 ? 0 : 10;

      // Tax (Example: 10% tax)
      state.tax = (state.subtotal - state.discount) * 0.1;

      // Final total calculation
      state.total = state.subtotal - state.discount + state.shippingFee + state.tax;

      // Persist updated cart data in localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("subtotal", JSON.stringify(state.subtotal));
      localStorage.setItem("shippingFee", JSON.stringify(state.shippingFee));
      localStorage.setItem("tax", JSON.stringify(state.tax));
      localStorage.setItem("total", JSON.stringify(state.total));
    },

    // ✅ Clear cart
    clearCart: (state) => {
      state.cartItems = [];
      state.discount = 0;
      state.appliedCoupon = null;
      state.shippingFee = 0;
      state.tax = 0;
      state.subtotal = 0;
      state.total = 0;

      // Remove from localStorage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("discount");
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("subtotal");
      localStorage.removeItem("shippingFee");
      localStorage.removeItem("tax");
      localStorage.removeItem("total");
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCart, 
  initializeCart,
  applyCoupon,
  removeCoupon,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

