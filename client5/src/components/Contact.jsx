import React from "react";

const contactStyles = {
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
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

const Contact = () => {
  return (
    <div style={contactStyles.container}>
      <h5 style={contactStyles.heading}>Contact Us</h5>
      <p>
        Have any questions or need assistance? Feel free to reach out to us.
      </p>
      <h5 style={contactStyles.heading}>Customer Support</h5>
      <p>Email: support@multivendormarketplace.com</p>
      <p>Phone: +1 234 567 890</p>
      <h5 style={contactStyles.heading}>Business Inquiries</h5>
      <p>Email: business@multivendormarketplace.com</p>
      <h5 style={contactStyles.heading}>Follow Us</h5>
      <ul style={contactStyles.list}>
        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={contactStyles.link}>Facebook</a></li>
        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={contactStyles.link}>Twitter</a></li>
        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={contactStyles.link}>Instagram</a></li>
        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={contactStyles.link}>LinkedIn</a></li>
      </ul>
    </div>
  );
};

export default Contact;

