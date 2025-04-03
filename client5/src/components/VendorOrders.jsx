import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  container: { padding: "20px", maxWidth: "600px", margin: "auto" },
  orderCard: { border: "1px solid #ddd", padding: "15px", marginBottom: "10px", borderRadius: "5px" },
  button: { padding: "8px 12px", background: "blue", color: "white", border: "none", cursor: "pointer" },
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/orders?vendor=true", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:2500/api/orders/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(prevOrders => prevOrders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Vendor Orders</h2>
      {orders.length === 0 ? <p>No orders found.</p> : (
        orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <button style={styles.button} onClick={() => updateStatus(order._id, "Shipped")}>
              Mark as Shipped
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorOrders;

