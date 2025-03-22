import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";;
import cartReducer from "./CartSlice";
import orderReducer from "./OrderSlice";


const Store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default Store;
