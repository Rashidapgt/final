import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: "#1a202c",
      color: "white",
      padding: "15px 0",
      textAlign: "center",
      fontSize: "13px",
    },
    footerContent: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "10px",
    },
    footerLinks: {
      marginBottom: "5px",
    },
    footerSocial: {
      marginBottom: "5px",
    },
    footerBottom: {
      marginTop: "5px",
      paddingTop: "5px",
      borderTop: "1px solid #2d3748",
    },
    footerLink: {
      color: "white",
      textDecoration: "none",
      marginRight: "8px",
      fontSize: "12px",
    },
    footerSocialLink: {
      color: "white",
      textDecoration: "none",
      marginRight: "8px",
      fontSize: "12px",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        {/* Quick Links */}
        <div style={styles.footerLinks}>
          <h4 style={{ fontSize: "14px", marginBottom: "5px" }}>Quick Links</h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li><Link to="/about" style={styles.footerLink}>About</Link></li>
            <li><Link to="/contact" style={styles.footerLink}>Contact</Link></li>
            <li><Link to="/privacy-policy" style={styles.footerLink}>Privacy</Link></li>
            <li><Link to="/terms" style={styles.footerLink}>Terms</Link></li>
          </ul>
        </div>
        
        {/* Social Media */}
        <div style={styles.footerSocial}>
          <h4 style={{ fontSize: "14px", marginBottom: "5px" }}>Follow Us</h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()}     Vendix-A Complete Shopping Platform !!  </p>
      </div>
    </footer>
  );
};

export default Footer;


