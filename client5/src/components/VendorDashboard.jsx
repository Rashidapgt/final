import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);

  const dashboardContainerStyle = {
    padding: "20px",
    backgroundColor: "#f8f8f8",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const cardStyle = {
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    minWidth: "250px",
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchVendorData(token);
  }, [navigate]);

  const fetchVendorData = async (token) => {
    try {
      const response = await fetch('http://localhost:2500/api/dashboard/vendor-dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      setVendorData(data); // Store vendor data in state
    } catch (error) {
      console.log('Error fetching vendor data:', error);
      navigate('/login');
    }
  };

  return (
    <div style={dashboardContainerStyle}>
      <h1 style={headerStyle}>Vendor Dashboard</h1>
      <div style={contentStyle}>
        {vendorData ? (
          <div style={cardStyle}>
            <h6>Total Orders: {vendorData.orders}</h6>
            <p>Revenue: ${vendorData.revenue}</p>
            {/* Render other vendor dashboard data */}
          </div>
        ) : (
          <p>Loading dashboard data...</p>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;






