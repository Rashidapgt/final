import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Cart icon
import axios from "axios"; // Axios for API calls
import { useSelector } from "react-redux"; // Assuming you still have a redux store

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]); // Local state for products
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState(true); // To handle loading state
  const { cartItems } = useSelector((state) => state.cart); // Assuming cart items are in redux

  // Calculate total items in the cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/products");
        console.log("API Response:", response.data); // Log the response
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          console.error("Expected an array of products but got:", response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();

    if (!Array.isArray(products)) {
      console.error("Products is not an array:", products);
      return;
    }

    console.log("Search Query:", search); // Log the search query
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
    );
    console.log("Filtered Results:", results); // Log the filtered results
    setFilteredProducts(results);
  };

  // Clear search results when search input is empty
  useEffect(() => {
    if (search === "") {
      setFilteredProducts([]);
    }
  }, [search]);

  // Define your styles object
  const inStyle = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#333",
      color: "white",
      position: "relative", // For positioning the search results dropdown
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
    },
    logo: {
      width: "50px",
      height: "50px",
      marginRight: "10px",
    },
    brand: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    navLinks: {
      listStyleType: "none",
      display: "flex",
      gap: "20px",
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      position: "relative", // For positioning the search results dropdown
    },
    searchInput: {
      padding: "5px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    searchButton: {
      padding: "5px 10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    cartContainer: {
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
    cartCount: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      backgroundColor: "red",
      color: "white",
      borderRadius: "50%",
      padding: "4px 8px",
      fontSize: "12px",
      minWidth: "20px",
      height: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cartIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    searchResults: {
      position: "absolute",
      top: "100%", // Position below the search bar
      left: "0",
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: "5px",
      width: "100%",
      maxHeight: "200px",
      overflowY: "auto",
      zIndex: 1000, // Ensure it appears above other elements
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    searchResultItem: {
      padding: "10px",
      color: "#333",
      textDecoration: "none",
      display: "block",
      borderBottom: "1px solid #eee",
    },
    searchResultItemHover: {
      backgroundColor: "#f5f5f5",
    },
  };

  return (
    <nav style={inStyle.navbar}>
      {/* Logo & Brand Name */}
      <div style={inStyle.logoContainer}>
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dud5wwx9h/image/upload/v1742676996/DALL_E_2025-03-17_15.40.12_-_A_modern_professional_logo_for_Vendix_a_multi-vendor_marketplace._The_design_should_include_a_sleek_shopping_cart_or_storefront_icon_with_a_vibra_a28imw.webp"
            alt="Marketplace Logo"
            style={inStyle.logo}
          />
        </Link>
        <h6 style={inStyle.brand}>Sell Smart, Buy Easy</h6>
      </div>

      {/* Navigation Links */}
      <ul style={inStyle.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/order-history">My Orders</Link></li>
        <li><Link to="/productlist">Product List</Link></li>
        <li><Link to="/cart">Cart</Link></li>
      </ul>


      {/* Cart Icon with Item Count */}
      <div style={inStyle.cartContainer}>
        <Link to="/cart" style={inStyle.cartIcon}>
          <FaShoppingCart size={24} color="white" />
          {totalItems > 0 && (
            <span style={inStyle.cartCount}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;





