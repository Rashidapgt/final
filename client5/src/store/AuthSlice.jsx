import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let user = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user = JSON.parse(storedUser);
    // Optionally check for a valid user object structure
    if (!user || !user.email) {
      user = null;
    }
  }
} catch (error) {
  console.error("Error parsing user data from localStorage", error);
}

const initialState = {
  user: user,
  isLoading: false,
  error: null,
  token: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "admin/register",
  async ({ name, email, password, role, storeName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:2500/api/admin/register",
        { name, email, password, role, storeName },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message === "User already exists") {
        return rejectWithValue("User already exists. Please try logging in.");
      }
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:2500/api/admin/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      if (user?.location) {
        localStorage.setItem("userLocation", JSON.stringify(user.location));
      } else {
        localStorage.setItem("userLocation", JSON.stringify({ country: "USA", state: "New York" })); // Default
      }
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid email or password");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "admin/logout",
  async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "admin/updateProfile",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:2500/api/admin/update-profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
