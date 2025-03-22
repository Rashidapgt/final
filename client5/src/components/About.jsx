import React from "react";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  heading: {
    color: "#2c3e50",
  },
  list: {
    paddingLeft: "20px",
  },
};

const About = () => {
  return (
    <div style={styles.container}>
      <h5 style={styles.heading}>About Us</h5>
      <p>
        Welcome to Multi-Vendor Marketplace, your go-to platform for buying and selling a variety of products from multiple vendors.
      </p>
      <h5 style={styles.heading}>Our Mission</h5>
      <p>
        We aim to provide a seamless shopping experience by connecting buyers and sellers in one convenient platform.
      </p>
      <h5 style={styles.heading}>Why Choose Us?</h5>
      <ul style={styles.list}>
        <li>Wide range of products from trusted vendors</li>
        <li>Secure payment options</li>
        <li>Real-time order tracking and notifications</li>
        <li>Excellent customer support</li>
      </ul>
    </div>
  );
};

export default About;
