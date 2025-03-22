import axios from "axios";

// Define an API call to trigger an email notification
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const response = await axios.post("/api/send-email", orderData); // POST request to backend
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendOrderConfirmationEmail };
