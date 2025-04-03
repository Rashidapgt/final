import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // Import useDispatch hook
import { addToCart } from "../store/CartSlice"; // Import the addToCart action
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const dispatch = useDispatch(); // Use dispatch hook
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:2500/api/products/${id}`);
        console.log("API Response:", response.data); // Debug API response
        setProduct(response.data.product || response.data); // Ensure correct structure
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const handleAddToCart = () => {
    console.log("Product Added to Cart: ", product);
    dispatch(addToCart(product)); // Dispatch addToCart action
  };

  const styles = {
    productDetailsContainer: {
      display: "flex",
      flexDirection: "row",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      gap: "20px",
      alignItems: "center",
    },
    productImage: {
      flex: 1,
      maxWidth: "300px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    productInfo: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    productInfoText: {
      marginBottom: "10px",
      fontSize: "16px",
      color: "#333",
    },
    addToCartButton: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.productDetailsContainer}>
      <div style={styles.productImage}>
        <img
          src={product.images || "https://via.placeholder.com/300"}
          alt={product.name}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>
      <div style={styles.productInfo}>
        <h6>{product.name}</h6>
        <p style={styles.productInfoText}>{product.description}</p>
        <p style={styles.productInfoText}>
          <strong>Price:</strong> ${product.price}
        </p>
        <button
          style={styles.addToCartButton}
          onClick={handleAddToCart} // Attach the function
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Add to Cart
        </button>
      </div>
      <Link to="/productlist">Continue Shopping</Link>
      {/* Pass correct product ID */}
      
      <ReviewForm productId={id}/>
     
    </div>
  );
};

export default ProductDetails;



