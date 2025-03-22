import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../store/OrderSlice";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, isLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId]);

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      maxWidth: "900px",
      margin: "0 auto",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333",
    },
    loadingText: {
      fontSize: "18px",
      color: "#007bff",
    },
    errorText: {
      fontSize: "18px",
      color: "red",
    },
    orderDetailsContainer: {
      backgroundColor: "#fff",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    orderItem: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      marginBottom: "10px",
    },
    orderItemLast: {
      padding: "10px",
      marginBottom: "10px",
    },
    list: {
      listStyleType: "none",
      paddingLeft: "0",
    },
    itemDetails: {
      fontSize: "16px",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Order Details</h2>
      {isLoading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>{error}</p>}
      {orderDetails && (
        <div style={styles.orderDetailsContainer}>
          <p style={styles.itemDetails}><strong>Order ID:</strong> {orderDetails._id}</p>
          <p style={styles.itemDetails}><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
          <p style={styles.itemDetails}><strong>Status:</strong> {orderDetails.status}</p>
          <h3>Items:</h3>
          <ul style={styles.list}>
            {orderDetails.items.map((item, index) => (
              <li
                key={item._id}
                style={index === orderDetails.items.length - 1 ? styles.orderItemLast : styles.orderItem}
              >
                {item.name} - {item.quantity} x ${item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

