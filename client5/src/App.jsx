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
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import ProfileForm from "./components/ProfileForm.jsx";
import NotificationSender from "./components/NotificationSender.jsx";
import VendorDashboard from "./components/VendorDashboard.jsx";
import BuyerDashboard from "./components/BuyerDashboard.jsx";
import ManageProducts from "./components/ManageProducts.jsx";
import Analytics from "./components/Analytics.jsx";
import Withdrawals from "./components/Withdrawals.jsx";
import PendingVendorsList from "./components/PendingVendorList.jsx";
import ManageProductsAdmin from "./components/ManageProductsAdmin.jsx";
import AdminOrders from "./components/AdminOrders.jsx";
import VendorOrders from "./components/VendorOrders.jsx";
import BuyerOrders from "./components/BuyerOrders.jsx";

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
          <Route path="/profileform" element={<ProfileForm />} />
         
          <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:categoryId" element={<ProductList />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard/products" element={<ProductList />} />
          <Route path="/dashboard/orders" element={<OrderHistory />} />
          <Route path="/notificationsender" element={<NotificationSender />} />
          
          
         
          <Route path="/manageproducts" element={<ManageProducts />}/>
          <Route path="/analytics" element={<Analytics />}/>
          <Route path="/withdrawals" element={<Withdrawals />}/>
          <Route path="/admin/pending-vendors" element={<PendingVendorsList />}/>
          <Route path="/admin/manageproducts" element={<ManageProductsAdmin />}/>
          <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/admin/*" element={<Dashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/*" element={<VendorDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/account/*" element={<BuyerDashboard />} />
        </Route>

          
          
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
};

export default App;
