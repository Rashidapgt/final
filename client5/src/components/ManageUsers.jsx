import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const inStyleManageUsers = {
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
  userList: {
    listStyleType: "none",
    padding: "0",
  },
  userItem: {
    backgroundColor: "#fff",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: "18px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#3498db",
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
  viewButton: {
    backgroundColor: "#3498db",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:2500/api/users");
        const data = await response.json();
        
        console.log("Fetched Users:", data);
        
        if (!Array.isArray(data)) {
          throw new Error("API response is not an array");
        }

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:2500/api/users/delete/${userId}`, {
        method: "DELETE",
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div style={inStyleManageUsers.container}>
      <h2 style={inStyleManageUsers.heading}>Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : Array.isArray(users) && users.length > 0 ? (
        <ul style={inStyleManageUsers.userList}>
          {users.map((user) => (
            <li key={user._id} style={inStyleManageUsers.userItem}>
              <span
                style={inStyleManageUsers.userName}
                onClick={() => handleViewUser(user._id)}
              >
                {user.name}
              </span>
              <div>
                <button
                  style={{
                    ...inStyleManageUsers.button,
                    ...inStyleManageUsers.viewButton,
                  }}
                  onClick={() => handleViewUser(user._id)}
                >
                  View
                </button>
                <button
                  style={{
                    ...inStyleManageUsers.button,
                    ...inStyleManageUsers.deleteButton,
                  }}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default ManageUsers;

