import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Store selected category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams(); // Get category ID from URL

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/categories");
        setCategories(response.data); // Assuming response contains categories
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch products based on selected category
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:2500/api/products";
        if (categoryId) {
          url += `?category=${categoryId}`; // Use category ID in URL
          setSelectedCategory(categoryId); // Set the selected category ID to maintain the dropdown value
        }

        console.log("Fetching products from:", url);
        const response = await axios.get(url);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleCategoryChange = (event) => {
    const newCategoryId = event.target.value;
    setSelectedCategory(newCategoryId);
    window.location.href = `/category/${newCategoryId}`; // Redirect to new category
  };

  // Inline styling
  const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
    },
    select: {
      padding: "10px",
      width: "200px",
      marginBottom: "15px",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    productList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
      justifyContent: "center",
      marginTop: "20px",
    },
    productCard: {
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      textAlign: "center",
      backgroundColor: "#fff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    productImage: {
      height: "200px",
      width: "100%",
      objectFit: "cover",
      marginBottom: "10px",
      borderRadius: "5px",
    },
    viewButton: {
      marginTop: "10px",
      padding: "8px 12px",
      backgroundColor: "#28a745",
      color: "white",
      textDecoration: "none",
      borderRadius: "5px",
      display: "inline-block",
    },
    loadingText: {
      fontSize: "18px",
      color: "#888",
    },
    errorText: {
      color: "red",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Products</h2>

      {/* Error Message */}
      {error && <p style={styles.errorText}>{error}</p>}

      {/* Category Dropdown */}
      <select value={selectedCategory} onChange={handleCategoryChange} style={styles.select}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Product List */}
      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : (
        <div style={styles.productList}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} style={styles.productCard}>
                <img
                  src={product.images || "https://via.placeholder.com/200"}
                  alt={product.name}
                  style={styles.productImage}
                />
                <h6>{product.name}</h6>
                <p>${product.price}</p>
                <Link to={`/products/${product._id}`} style={styles.viewButton}>
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;






