// CartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      // Check if the product already exists in the cart
      const existingProduct = state.cartItems.find(item => item._id === product._id);

      if (existingProduct) {
        existingProduct.quantity += 1; // Increment quantity if it exists
      } else {
        state.cartItems.push({ ...product, quantity: 1 }); // Add new product with quantity 1
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
    },
    updateCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.cartItems.find(item => item._id === productId);
      if (product) {
        product.quantity = quantity;
      }
    },
    initializeCart: (state, action) => {
      state.cartItems = action.payload;
    },
    applyCoupon: (state, action) => {
      state.discount = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateCart, applyCoupon,initializeCart } = cartSlice.actions;
export default cartSlice.reducer;
