import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Style objects
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
    },
    heroSection: {
      textAlign: "center",
      padding: "60px 20px",
      background: "linear-gradient(135deg,rgb(250, 248, 245) 0%, #c3cfe2 100%)",
      borderRadius: "10px",
      marginBottom: "40px",
    },
    title: {
      fontSize: "2.5rem",
      color:"#2c3e50",
      marginBottom: "20px",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#7f8c8d",
      maxWidth: "700px",
      margin: "0 auto 30px",
    },
    ctaButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
    },
    button: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "5px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    primaryButton: {
      backgroundColor: "#3498db",
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "white",
      color: "#3498db",
      border: "1px solid #3498db",
    },
    buttonHover: {
      primary: {
        backgroundColor: "#2980b9",
      },
      secondary: {
        backgroundColor: "#f8f9fa",
      },
    },
    sectionTitle: {
      textAlign: "center",
      marginBottom: "40px",
      color: "#2c3e50",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
      marginBottom: "60px",
    },
    featureCard: {
      padding: "30px",
      borderRadius: "8px",
      backgroundColor: "white",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "transform 0.3s ease",
    },
    featureIcon: {
      fontSize: "2.5rem",
      marginBottom: "20px",
    },
    featureTitle: {
      color: "#3498db",
      marginBottom: "15px",
    },
    testimonialsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
    },
    testimonialCard: {
      padding: "30px",
      borderRadius: "8px",
      backgroundColor: "white",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
    testimonialAuthor: {
      fontWeight: "bold",
      color: "#3498db",
    },
  };

  // For hover effects
  const handleMouseEnter = (e, type) => {
    if (type === 'primary') {
      e.target.style.backgroundColor = styles.buttonHover.primary.backgroundColor;
    } else {
      e.target.style.backgroundColor = styles.buttonHover.secondary.backgroundColor;
    }
  };

  const handleMouseLeave = (e, type) => {
    if (type === 'primary') {
      e.target.style.backgroundColor = styles.primaryButton.backgroundColor;
    } else {
      e.target.style.backgroundColor = styles.secondaryButton.backgroundColor;
    }
  };

  // Enhanced navigation function with error handling
  const handleBrowseProducts = () => {
    console.log("Attempting to navigate to /products");
    try {
      navigate('/productlist', { replace: false });
      console.log("Navigation successful");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to window.location if client-side navigation fails
      window.location.href = '/productlist';
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h4 style={styles.title}>Welcome to Vendix</h4>
        <p style={styles.subtitle}>
          Your one-stop marketplace to discover, buy, and sell products from multiple vendors
        </p>
        
        {/* Call-to-Action Buttons */}
        <div style={styles.ctaButtons}>
          <button 
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleBrowseProducts}
            onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
            onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
            aria-label="Browse our products"
          >
            Browse Products
          </button>
          
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 style={styles.sectionTitle}>Why Choose Vendix?</h2>
        <div style={styles.featuresGrid}>
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={styles.featureIcon}>🛒</div>
            <h5 style={styles.featureTitle}>Wide Selection</h5>
            <p>Thousands of products from trusted vendors all in one place</p>
          </div>
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={styles.featureIcon}>🔒</div>
            <h5 style={styles.featureTitle}>Secure Payments</h5>
            <p>Safe and encrypted transactions for your peace of mind</p>
          </div>
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={styles.featureIcon}>🚚</div>
            <h5 style={styles.featureTitle}>Fast Delivery</h5>
            <p>Get your products delivered quickly with our reliable partners</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div>
        <h5 style={styles.sectionTitle}>What Our Customers Say</h5>
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonialCard}>
            <p>"Vendix saved me so much time! I can shop from multiple stores in one checkout."</p>
            <div style={styles.testimonialAuthor}>- Sarah J.</div>
          </div>
          <div style={styles.testimonialCard}>
            <p>"As a small business owner, Vendix helped me reach so many more customers."</p>
            <div style={styles.testimonialAuthor}>- Michael T.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
