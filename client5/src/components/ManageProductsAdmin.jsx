import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
  const token = localStorage.getItem("token");

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "80%",
      margin: "20px auto",
    },
    title: {
      textAlign: "center",
      color: "#333",
      fontSize: "24px",
      marginBottom: "20px",
    },
    productList: {
      listStyleType: "none",
      padding: "0",
    },
    productItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#fff",
      marginBottom: "10px",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    input: {
      padding: "8px",
      margin: "5px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "100%",
    },
    button: {
      padding: "10px 15px",
      border: "none",
      backgroundColor: "#28a745",
      color: "#fff",
      cursor: "pointer",
      borderRadius: "4px",
      margin: "0 5px",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
    },
    editButton: {
      backgroundColor: "#ffc107",
    },
    noProducts: {
      textAlign: "center",
      color: "#777",
      fontSize: "18px",
    },
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:2500/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      console.log("Attempting to delete product:", productId); // Debugging log
  
      const response = await axios.delete(`http://localhost:2500/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Delete response:", response.data); // Log the response
  
      if (response.status === 200) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        console.error("Error deleting product: Unexpected response", response.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
    }
  };
  const startEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({ name: product.name, price: product.price, stock: product.stock });
  };

  const updateProduct = async () => {
    try {
      await axios.put(`http://localhost:2500/api/products/${editingProduct}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProduct(null);
      fetchProducts(); // Refresh product list after update
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Products</h2>
      <ul style={styles.productList}>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product._id} style={styles.productItem}>
              {editingProduct === product._id ? (
                <>
                  <input
                    style={styles.input}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                  <button style={styles.button} onClick={updateProduct}>Save</button>
                  <button style={styles.button} onClick={() => setEditingProduct(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{product.name} - ${product.price} - Stock: {product.stock}</span>
                  <div>
                    <button style={{ ...styles.button, ...styles.editButton }} onClick={() => startEdit(product)}>Edit</button>
                    <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => deleteProduct(product._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <p style={styles.noProducts}>No products found</p>
        )}
      </ul>
    </div>
  );
};

export default ManageProductsAdmin;





