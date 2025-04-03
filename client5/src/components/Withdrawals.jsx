import React, { useState, useEffect } from "react";
import axios from "axios";

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/dashboard/withdrawals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWithdrawals(response.data.withdrawals);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      }
    };

    fetchWithdrawals();
  }, [token]);

  const handleWithdrawalRequest = async () => {
    if (!amount || !paymentMethod) {
      return alert("Please fill all fields.");
    }

    try {
      const response = await axios.post(
        "http://localhost:2500/api/dashboard/withdraw",
        { amount, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setWithdrawals([...withdrawals, response.data.withdrawal]);
      setAmount("");
      setPaymentMethod("");
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
    }
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      marginTop: "20px",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    item: {
      fontSize: "1.2rem",
      marginBottom: "10px",
    },
    form: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    input: {
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    button: {
      padding: "10px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Withdraw Earnings</h2>
      
      <div>
        <h3 style={styles.item}>Past Withdrawals</h3>
        {withdrawals.length === 0 ? (
          <p>No withdrawal requests found.</p>
        ) : (
          withdrawals.map((withdrawal) => (
            <p key={withdrawal._id} style={styles.item}>
              {withdrawal.amount} - {withdrawal.status} (Method: {withdrawal.paymentMethod})
            </p>
          ))
        )}
      </div>

      <div style={styles.form}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleWithdrawalRequest} style={styles.button}>
          Request Withdrawal
        </button>
      </div>
    </div>
  );
};

export default Withdrawals;
