import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./components/Cart";
import CheckoutPage from "./components/CheckoutPage";
import Login from "./components/Login";
import OrderHistory from "./components/OrderHistoryPage.jsx";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductLists.jsx";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard.jsx";
import OrderDetails from "./components/OrderDetails.jsx";
import ApproveVendors from "./components/ApproveVendors.jsx";
import ManageUsers from "./components/ManageUsers.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";



const App = () => {
  return (
    <Router>
      <Navbar /> 
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:categoryId" element={<ProductList />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard/products" element={<ProductList />} />
          <Route path="/dashboard/approve-vendors" element={<ApproveVendors />} />
          <Route path="/dashboard/manage-users" element={<ManageUsers />} />
          <Route path="/dashboard/orders" element={<OrderHistory />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
};

export default App;
