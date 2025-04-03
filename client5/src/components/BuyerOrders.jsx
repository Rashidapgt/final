import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  container: { padding: "20px", maxWidth: "600px", margin: "auto" },
  orderCard: { border: "1px solid #ddd", padding: "15px", marginBottom: "10px", borderRadius: "5px" },
  title: { fontSize: "20px", marginBottom: "10px" },
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Orders</h2>
      {orders.length === 0 ? <p>No orders found.</p> : (
        orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BuyerOrders;
