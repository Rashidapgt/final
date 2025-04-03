import React, { useState } from "react";
import axios from "axios";


const styles = {
  form: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" },
  input: { padding: "10px", border: "1px solid #ddd" },
  button: { padding: "10px", cursor: "pointer", background: "green", color: "#fff" },
};

const ManageProducts = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    file: null,
    category: "",
  });

  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    if (e.target.name === "file") {
      setNewProduct({ ...newProduct, file: e.target.files[0] });
    } else {
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    }
  };

  // Add new product
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.file) {
      return alert("Please fill all fields and upload an image");
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock);
    formData.append("file", newProduct.file);

    try {
      const response = await axios.post("http://localhost:2500/api/products", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      setNewProduct({ name: "", description: "", price: "", stock: "", file: null, category: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <div style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={newProduct.description}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button onClick={addProduct} style={styles.button}>
          Add Product
        </button>
      </div>
      
    </div>
  );
};

export default ManageProducts;










