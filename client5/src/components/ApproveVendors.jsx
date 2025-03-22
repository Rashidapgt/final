import React, { useEffect, useState } from "react";

const inStyleApproveVendors = {
  container: {
    padding: "20px",
    backgroundColor: "#ecf0f1",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  vendorList: {
    listStyleType: "none",
    padding: "0",
  },
  vendorItem: {
    backgroundColor: "#fff",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "none",
    marginLeft: "10px",
  },
  approveButton: {
    backgroundColor: "#27ae60",
    color: "#fff",
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
};

const ApproveVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:2500/api/vendors");
        const data = await response.json();

        console.log("Fetched vendors:", data); // Debugging log

        if (Array.isArray(data)) {
          setVendors(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError("Failed to fetch vendors");
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleApprove = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:2500/api/admin/approve-vendor/${vendorId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to approve vendor");
      }

      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== vendorId));
    } catch (err) {
      console.error("Error approving vendor:", err);
    }
  };

  const handleReject = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:2500/api/vendors/reject/${vendorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to reject vendor");
      }

      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== vendorId));
    } catch (err) {
      console.error("Error rejecting vendor:", err);
    }
  };

  return (
    <div style={inStyleApproveVendors.container}>
      <h2 style={inStyleApproveVendors.heading}>Approve Vendors</h2>
      {loading ? (
        <p>Loading vendors...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : vendors.length === 0 ? (
        <p>No pending vendors.</p>
      ) : (
        <ul style={inStyleApproveVendors.vendorList}>
          {vendors.map((vendor) => (
            <li key={vendor._id} style={inStyleApproveVendors.vendorItem}>
              <span>{vendor.name}</span>
              <div>
                <button
                  style={{
                    ...inStyleApproveVendors.button,
                    ...inStyleApproveVendors.approveButton,
                  }}
                  onClick={() => handleApprove(vendor._id)}
                >
                  Approve
                </button>
                <button
                  style={{
                    ...inStyleApproveVendors.button,
                    ...inStyleApproveVendors.rejectButton,
                  }}
                  onClick={() => handleReject(vendor._id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveVendors;


