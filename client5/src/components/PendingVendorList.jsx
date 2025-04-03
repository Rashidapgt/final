import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PendingVendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pending vendors from backend
    const fetchPendingVendors = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/admin/pending-vendors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setVendors(response.data.vendors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending vendors:", error);
        setLoading(false);
      }
    };

    fetchPendingVendors();
  }, []);

  // Handle approving vendor
  const handleApprove = async (vendorId) => {
    try {
      await axios.put(`http://localhost:2500/api/admin/approve-vendor/${vendorId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setVendors(vendors.filter(vendor => vendor._id !== vendorId)); // Remove the approved vendor from the list
      alert("Vendor approved successfully");
    } catch (error) {
      console.error("Error approving vendor:", error);
    }
  };

  // Render Pending Vendors List
  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Pending Vendors</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Vendor Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: "center" }}>No pending vendors</td></tr>
            ) : (
              vendors.map(vendor => (
                <tr key={vendor._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{vendor.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{vendor.email}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button onClick={() => handleApprove(vendor._id)} style={{ backgroundColor: "green", color: "#fff", padding: "5px 10px", cursor: "pointer" }}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingVendorsList;
